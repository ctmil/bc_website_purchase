from openerp import models, api, fields

class purchase_order_line(models.Model):
    _inherit = "purchase.order.line"

    leadtime = fields.Integer('Leadtime', default=10, help='Requested leadtime in days.')