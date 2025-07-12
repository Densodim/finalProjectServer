# -*- coding: utf-8 -*-

from odoo import models, fields, api
import requests
import json
import logging

_logger = logging.getLogger(__name__)

class FormTemplate(models.Model):
    _inherit = 'form.template'

    api_token = fields.Char('API Token', help='API token for importing data from external system')
    import_url = fields.Char('Import URL', default='http://localhost:3000/api/aggregated-results')

    def action_import_from_api(self):
        """Action for importing data from external API"""
        for record in self:
            if not record.api_token:
                raise models.ValidationError('API token is required for import')
            
            try:
                # Get data from API
                headers = {
                    'Authorization': f'Bearer {record.api_token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.get(record.import_url, headers=headers, timeout=30)
                response.raise_for_status()
                
                results = response.json()
                
                # Import results
                imported_count = self._import_results(results)
                
                # Show success message
                return {
                    'type': 'ir.actions.client',
                    'tag': 'display_notification',
                    'params': {
                        'title': 'Import Successful',
                        'message': f'Successfully imported {imported_count} templates',
                        'type': 'success',
                        'sticky': False,
                    }
                }
                
            except requests.exceptions.RequestException as e:
                _logger.error(f'API request failed: {e}')
                raise models.ValidationError(f'Failed to import data: {str(e)}')
            except Exception as e:
                _logger.error(f'Import failed: {e}')
                raise models.ValidationError(f'Import failed: {str(e)}')

    def _import_results(self, results):
        """Imports results into Odoo"""
        imported_count = 0
        
        for result in results:
            # Create or update template
            template_vals = {
                'external_id': str(result['templateId']),
                'title': result['templateTitle'],
                'author': result['templateAuthor'],
                'total_responses': result['totalResponses'],
                'created_at': result['createdAt'],
                'updated_at': result['updatedAt'],
            }
            
            existing_template = self.search([('external_id', '=', str(result['templateId']))])
            
            if existing_template:
                existing_template.write(template_vals)
                template = existing_template
            else:
                template = self.create(template_vals)
            
            # Import questions
            for question in result['questions']:
                question_vals = {
                    'external_id': str(question['questionId']),
                    'template_id': template.id,
                    'question_text': question['questionText'],
                    'question_type': question['questionType'],
                    'total_answers': question['totalAnswers'],
                    'aggregated_result': json.dumps(question['aggregatedResult']),
                }
                
                existing_question = self.env['form.question'].search([
                    ('external_id', '=', str(question['questionId']))
                ])
                
                if existing_question:
                    existing_question.write(question_vals)
                else:
                    self.env['form.question'].create(question_vals)
            
            imported_count += 1
        
        return imported_count

    def action_view_questions(self):
        """Action for viewing template questions"""
        return {
            'name': f'Questions - {self.title}',
            'type': 'ir.actions.act_window',
            'res_model': 'form.question',
            'view_mode': 'tree,form',
            'domain': [('template_id', '=', self.id)],
            'context': {'default_template_id': self.id},
        } 