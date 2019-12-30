export enum AuthRoles {
    AUTHENTICATED = 'authenticated',

    CONTACTS_READ = 'contacts_read',
    CONTACTS_EDIT = 'contacts_edit',

    MEMBERS_READ = 'members_read',
    MEMBERS_EDIT = 'members_edit',

    MAILING_LISTS = 'mailing_lists',

    RANKS_READ = 'ranks_read',
    RANKS_EDIT = 'ranks_edit',

    ORDERS_READ = 'orders_read',
    ORDERS_EDIT = 'orders_edit',

    COMPENSATIONS_READ = 'compensations_read',
    COMPENSATIONS_CREATE = 'compensations_create',
    COMPENSATIONS_EDIT = 'compensations_edit',
    COMPENSATIONS_APPROVE = 'compensations_approve',

    BILLINGREPORTS_READ = 'billingreports_read',
    BILLINGREPORTS_CREATE = 'billingreports_create',
    BILLINGREPORTS_EDIT = 'billingreports_edit',
    BILLINGREPORTS_APPROVE = 'billingrepors_approve',

    DRAFT_READ = 'draft_read',
    DRAFT_CREATE = 'draft_create',
    DRAFT_EDIT = 'draft_edit',

    PAYOUTS_READ = 'payouts_read',
    PAYOUTS_CREATE = 'payouts_create',
    PAYOUTS_SEND = 'payouts_send',

    ADMIN = 'admin'
}