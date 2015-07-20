{
    'name': 'Purchase Quotation Online Proposals',
    'category': 'Website',
    'version': '1.1',
    'description': """
GURBA
=========================

        """,
    'depends': ['website', 'mail', 'purchase', 'purchase_requisition','product'],
    'data': [
        'wizards/request_relevant_suppliers.xml',
        'views/website_quotation.xml',
        'views/website_quotation_backend.xml',
        #'views/report_saleorder.xml',
        'data/website_quotation_data.xml',
        'security/ir.model.access.csv',
    ],
    'js': ['static/js/bc_website_purchase.js'],
    'demo': [
        # 'data/website_quotation_demo.xml'
    ],
    'qweb': [
        'static/xml/*.xml',
        'static/src/xml/*.xml',
     ],
    'test': [
        'statis/test/demo.js',    
    ],
    'installable': True,
    'application': True,
}
