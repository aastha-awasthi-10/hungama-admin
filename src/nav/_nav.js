export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'nav-icon fa fa-tachometer',
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'nav-icon fa fa-users',
    },
    {
      name: 'Sub Admins',
      url: '/sub-admins',
      icon: 'nav-icon fa fa-users',
    },
    {
      name: 'Banners',
      url: '/banners',
      icon: 'nav-icon fa fa-flag',
    },
    {
      name: 'Web Banners',
      url: '/web-banners',
      icon: 'nav-icon fa fa-flag',
    },
    {
      name: 'Quiz Category',
      url: '/quiz-category',
      icon: 'nav-icon fa fas fa-list',
    },
    {
      name: 'Quizzes',
      url: '/quizzes',
      icon: 'nav-icon fa fa-question-circle',
    },
    {
      name: 'Contests',
      url: '/contests',
      icon: 'nav-icon fa fa-arrows-alt',
    },
    {
      name: 'Questions',
      url: '/questions',
      icon: 'nav-icon fa fa-question',
    },
    // {
    //   name: 'Reward Points',
    //   url: '/rewards',
    //   icon: 'nav-icon fa fa-asterisk',
    // },
    // {
    //   name: 'Withdraw Request',
    //   url: '/withdraw',
    //   icon: 'nav-icon fa fa-asterisk',
    // },
    {
      name: 'Quiz Matches ',
      url: '/quiz-matches',
      icon: 'nav-icon fa fa-list-alt',
    },
    {
      name: 'Wallet Manager',
      url: '/wallets',
      icon: 'nav-icon fa fa-money',
    },
    {
      name: 'Earning Manager',
      url: '/earnings',
      icon: 'nav-icon fa fa-money',
      children: [{
        name: 'Quiz Earning',
        url: '/earning/quiz',
        icon: 'nav-icon fa fa-question-circle',
      },
      {
        name: 'Contests Earning',
        url: '/earning/contests',
        icon: 'nav-icon fa fa-arrows-alt',
      }
      ]
    },
    {
      name: 'Account Statement ',
      url: '/statements',
      icon: 'nav-icon fa fa-list-alt',
    },
    {
      name: 'Withdraw Request ',
      url: '/withdarwals',
      icon: 'nav-icon fa fa-arrow-down',
    },
    {
      name: 'Transactions ',
      url: '/transactions',
      icon: 'nav-icon fa fa-exchange',
    },
    {
      name: 'TDS Details',
      url: '/tds-details',
      icon: 'nav-icon fa fa-list',
    }, 
    {
      name: 'Coupons',
      url: '/coupons',
      icon: 'nav-icon fa fa-gift',
    },
    {
      name: 'News',
      url: '/news',
      icon: 'nav-icon fa fa-newspaper-o',
    },
    {
      name: 'Videos',
      url: '/videos',
      icon: 'nav-icon fa fa-play',
    },
    {
      name: 'Ads',
      url: '/ads',
      icon: 'nav-icon fa fa-newspaper-o',
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
    {
      name: 'Gst Report',
      url: '/gst-report',
      icon: 'nav-icon fa fa-money',
    },
  ],
};
