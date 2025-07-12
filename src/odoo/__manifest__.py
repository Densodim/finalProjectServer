# -*- coding: utf-8 -*-

{
    'name': 'Form Templates Viewer',
    'version': '1.0',
    'category': 'Survey',
    'summary': 'View and import form templates with aggregated results',
    'description': """
        This module allows you to:
        - View form templates with their questions
        - Import aggregated results from external API
        - Display aggregated statistics for form responses
        - Store and manage form templates and questions
    """,
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'depends': ['base', 'survey'],
    'data': [
        'views/odoo-views.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
} 