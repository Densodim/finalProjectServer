# -*- coding: utf-8 -*-

from odoo import models, fields, api

class FormTemplate(models.Model):
    _name = 'form.template'
    _description = 'Form Template'
    _order = 'created_at DESC'

    external_id = fields.Char('External ID', required=True, unique=True)
    title = fields.Char('Title', required=True)
    author = fields.Char('Author', required=True)
    total_responses = fields.Integer('Total Responses', default=0)
    created_at = fields.Datetime('Created At')
    updated_at = fields.Datetime('Updated At')
    
    question_ids = fields.One2many('form.question', 'template_id', string='Questions')

class FormQuestion(models.Model):
    _name = 'form.question'
    _description = 'Form Question'
    _order = 'id ASC'

    external_id = fields.Char('External ID', required=True, unique=True)
    template_id = fields.Many2one('form.template', string='Template', required=True, ondelete='cascade')
    question_text = fields.Text('Question Text', required=True)
    question_type = fields.Selection([
        ('text', 'Text'),
        ('comment', 'Comment'),
        ('radiogroup', 'Radio Group'),
        ('checkbox', 'Checkbox'),
        ('email', 'Email'),
        ('number', 'Number'),
        ('file', 'File')
    ], string='Question Type', required=True)
    total_answers = fields.Integer('Total Answers', default=0)
    aggregated_result = fields.Text('Aggregated Result')

    @api.model
    def create(self, vals):
        # Automatically create external_id if not specified
        if not vals.get('external_id'):
            vals['external_id'] = f"q_{self.env['ir.sequence'].next_by_code('form.question')}"
        return super().create(vals)

class FormTemplate(models.Model):
    _inherit = 'form.template'

    @api.model
    def create(self, vals):
        # Automatically create external_id if not specified
        if not vals.get('external_id'):
            vals['external_id'] = f"t_{self.env['ir.sequence'].next_by_code('form.template')}"
        return super().create(vals) 