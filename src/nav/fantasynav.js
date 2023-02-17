export default {
  items: [
    {
      name: 'Dashboard',
      url: '/fantasy-dashboard',
      icon: 'nav-icon fa fa-tachometer',
    },
    {
      name: 'Sub Admins',
      url: '/sub-admins',
      icon: 'nav-icon fa fa-users',
    },
    {
      name: 'User Management',
      url: '/users',
      icon: 'nav-icon fa fa-users',
    },
    // {
    //   name: 'Fantasy Banners',
    //   url: '/banners',
    //   icon: 'nav-icon fa fa-flag',
    // },
    // {
    //   name: 'HomeBanners',
    //   url: '/home-banners',
    //   icon: 'nav-icon fa fa-flag',
    // },
    // {
    //   name: 'CricketBanner',
    //   url: '/edit-cricket-banner',
    //   icon: 'nav-icon fa fa-flag',
    // },
    // {
    //   name: 'RummyBanner',
    //   url: '/edit-rummy-banner',
    //   icon: 'nav-icon fa fa-flag',
    // },
    // {
    //   name: 'WebBanner',
    //   url: '/edit-web-banner',
    //   icon: 'nav-icon fa fa-flag',
    // },
    {
      name: 'Banners',
      url: '/',
      icon: 'nav-icon fa fa-list-alt',
      children: [
        {
          name: 'Fantasy Banners',
          url: '/banners',
          icon: 'nav-icon fa fa-flag',
        },
        {
          name: 'Home Banners',
          url: '/home-banners',
          icon: 'nav-icon fa fa-flag',
        },        
        {
          name: 'Cricket Banner',
          url: '/edit-cricket-banner',
          icon: 'nav-icon fa fa-flag',
        },
        // {
        //   name: 'Rummy Banner',
        //   url: '/edit-rummy-banner',
        //   icon: 'nav-icon fa fa-flag',
        // },
        // {
        //   name: 'Web Banner',
        //   url: '/edit-web-banner',
        //   icon: 'nav-icon fa fa-flag',
        // },
      ]
    },
    {
      name: 'Faqs',
      url: '/faqs',
      icon: 'nav-icon fa fa-flag',
    },
    {
      name: 'Coupons',
      url: '/coupons',
      icon: 'nav-icon fa fa-gift',
    },  
    {
      name: 'Cricket',
      url: '/cricket',
      icon: 'nav-icon fa fa-list-alt',
      children: [
        {
          name: 'Category',
          url: '/cricket/category',
          icon: 'nav-icon fa fas fa-list',
        },
        {
          name: 'Contests',
          url: '/cricket/contests',
          icon: 'nav-icon fa fa-arrows-alt',
        },
        {
          name: 'User Contests',
          url: '/cricket/user-contests',
          icon: 'nav-icon fa fa-arrows-alt',
        },
        {
          name: 'Series',
          url: '/cricket/series',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Point System',
          url: '/cricket/point-system',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Teams',
          url: '/cricket/mst-teams',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Player Manager',
          url: '/cricket/series-players',
          icon: 'nav-icon fa fa-list-alt',
        },
        {
          name: 'Schedule Contest',
          url: '/cricket/schedule-contest',
          icon: 'nav-icon fa fa-list',
        }
      ]
    },
    {
      name: 'Wallet Manager',
      url: '/wallets',
      icon: 'nav-icon fa fa-money',
    },
    {
      name: 'Earning Manager',
      url: '/earning',
      icon: 'nav-icon fa fa-money',
    },
    {
      name: 'Account Statement',
      url: '/statements',
      icon: 'nav-icon fa fa-list-alt',
    },
    {
      name: 'Withdraw Request',
      url: '/withdarwals',
      icon: 'nav-icon fa fa-arrow-down',
    },
    {
      name: 'Transactions',
      url: '/transactions',
      icon: 'nav-icon fa fa-exchange',
    },
    {
      name: 'TDS Details',
      url: '/tds-details',
      icon: 'nav-icon fa fa-list',
    },
    {
      name: 'Gst Report',
      url: '/gst-report',
      icon: 'nav-icon fa fa-money',
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'nav-icon fa fa-bell',
    },
    {
      name: 'Email Templates',
      url: '/email-templates',
      icon: 'nav-icon fa fa-folder-open-o',
    },
    {
      name: 'Static Pages',
      url: '/static-pages',
      icon: 'nav-icon fa fa-file',
    },
    {
      name: 'Settings',
      url: '/settings',
      icon: 'nav-icon fa fa-gear',
    },
  ],
};
