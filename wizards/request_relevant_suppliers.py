__author__ = 'tbri'
from openerp import fields, models, api, _


class request_relevant_suppliers(models.TransientModel):
    _name = "bc_website_purchase.requisition.suppliers"
    _description = "Purchase Requisition Suppliers"

    product_suppliers = fields.Many2many('res.partner',
        string='Suppliers', domain=[('supplier', '=', True)])

    @api.model
    def view_init(self, fields_list):
        print "VIEW INIT V8"
    """
    def view_init(self, cr, uid, fields_list, context=None):
        if context is None:
            context = {}
        res = super(purchase_requisition_partner, self).view_init(cr, uid, fields_list, context=context)
        record_id = context and context.get('active_id', False) or False
        tender = self.pool.get('purchase.requisition').browse(cr, uid, record_id, context=context)
        if not tender.line_ids:
            raise osv.except_osv(_('Error!'), _('Define product(s) you want to include in the call for bids.'))
        return res

    def create_order(self, cr, uid, ids, context=None):
        active_ids = context and context.get('active_ids', [])
        data =  self.browse(cr, uid, ids, context=context)[0]
        self.pool.get('purchase.requisition').make_purchase_order(cr, uid, active_ids, data.partner_id.id, context=context)
        return {'type': 'ir.actions.act_window_close'}
    """