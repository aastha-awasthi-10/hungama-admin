export default {
    items: [{
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
    },

    {
        name: 'Matches',
        url: '/matches',
        icon: 'nav-icon fa fa-trophy',
        children: [{
            name: 'Cricket',
            url: '/matches/cricketlists',
            icon: 'nav-icon icon-star',
        },
        {
            name: 'Cricket Market Watch',
            url: '/matches/cricket-market-watch',
            icon: 'nav-icon icon-star',
        }
        ],
    },
    {
        name: 'Billers',
        url: '/super-masters',
        icon: 'nav-icon fa fa-users',
    },
    {
        name: 'Static Pages',
        url: '/static-pages',
        icon: 'nav-icon fa fa-desktop',
    },
    {
        name: 'Email Templates',
        url: '/email-templates',
        icon: 'nav-icon fa fa-folder-open-o',
    },
    {
        name: 'Fancy Cricket',
        url: '/fancy-cricket',
        icon: 'nav-icon fa fa-diamond',
    },
    {
        name: 'Settings',
        url: '/settings',
        icon: 'nav-icon fa fa-gear',
    },
    {
        name: 'Notifications',
        url: '/notifications',
        icon: 'nav-icon fa fa-bell',
    },
    {
        name: 'Gst Report',
        url: '/gst-report',
        icon: 'nav-icon fa fa-money',
      },
    ],
};
