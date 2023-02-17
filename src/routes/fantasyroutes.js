import React from 'react';

const Dashboard = React.lazy(() => import('../views/Dashboard/Dashboard'));
const FantasyDashboard = React.lazy(() => import('../views/Dashboard/FantasyDashboard'));
const GSTReport = React.lazy(() => import('../views/GstReport/GSTReport'));

const UserProfile = React.lazy(() => import('../views/CommanPage/UserProfile'));
const ChangePass = React.lazy(() => import('../views/CommanPage/ChangePass'));

const Users = React.lazy(() => import('../views/Users/Users'));
const AddUser = React.lazy(() => import('../views/Users/AddUser'));
const EditUser = React.lazy(() => import('../views/Users/EditUser'));

// const Tokens = React.lazy(() => import('../views/Tokens/Tokens'));
// const AddToken = React.lazy(() => import('../views/Tokens/AddToken'));
// const EditToken = React.lazy(() => import('../views/Tokens/EditToken'));

// const WebBanners = React.lazy(() => import('../views/Banners/WebBanners'));
// const EditWebBanner = React.lazy(() => import('../views/Banners/EditWebBanner'));

const SubAdmins = React.lazy(() => import('../views/SubAdmin/SubAdmins'));
const AddSubAdmin = React.lazy(() => import('../views/SubAdmin/AddSubAdmin'));
const EditSubAdmin = React.lazy(() => import('../views/SubAdmin/EditSubAdmin'));

const Banners = React.lazy(() => import('../views/Banners/Banners'));
const AddBanner = React.lazy(() => import('../views/Banners/AddBanner'));
const EditBanner = React.lazy(() => import('../views/Banners/EditBanner'));

const HomeBanners = React.lazy(() => import('../views/HomeBanners/HomeBanners'));
const AddHomeBanner = React.lazy(() => import('../views/HomeBanners/AddHomeBanner'));
const EditHomeBanner = React.lazy(() => import('../views/HomeBanners/EditHomeBanner'));

const BottomBanners = React.lazy(() => import('../views/BottomBanners/BottomBanners'));
const AddBottomBanner = React.lazy(() => import('../views/BottomBanners/AddBottomBanner'));
const EditBottomBanner = React.lazy(() => import('../views/BottomBanners/EditBottomBanner'));
const EditWebBanner = React.lazy(() => import('../views/BottomBanners/EditWebBanner'));
const EditRummyBanner = React.lazy(() => import('../views/BottomBanners/EditRummyBanner'));


const Faq = React.lazy(() => import('../views/Faqs/Faq'));
const AddFaq = React.lazy(() => import('../views/Faqs/AddFaq'));
const EditFaq = React.lazy(() => import('../views/Faqs/EditFaq'));

// const News = React.lazy(() => import('../views/News/News'));
// const AddNews = React.lazy(() => import('../views/News/AddNews'));
// const EditNews = React.lazy(() => import('../views/News/EditNews'));

const Coupons = React.lazy(() => import('../views/Coupons/Coupons'));
const AddCoupon = React.lazy(() => import('../views/Coupons/AddCoupon'));
const EditCoupon = React.lazy(() => import('../views/Coupons/EditCoupon'));
const ListCouponUsers = React.lazy(() => import('../views/Coupons/ListCouponUsers'));

const StaticPages = React.lazy(() => import('../views/StaticPages/StaticPages'));
const EditStaticPage = React.lazy(() => import('../views/StaticPages/EditStaticPage'));

const EmailTemplates = React.lazy(() => import('../views/EmailTemplates/EmailTemplates'));
const EditEmailTemplate = React.lazy(() => import('../views/EmailTemplates/EditEmailTemplate'));

const Settings = React.lazy(() => import('../views/Settings/Settings'));
const Notifications = React.lazy(() => import('../views/Notifications/Notifications'));
const Transactions = React.lazy(() => import('../views/Transactions/Transactions'));
const AccountStatement = React.lazy(() => import('../views/AccountStatement/AccountStatement'));
const WithdrawRequests = React.lazy(() => import('../views/Withdrawals/WithdrawRequests'));
const QuizMatches = React.lazy(() => import('../views/quizMatches/quizMatches'));

const WalletManager = React.lazy(() => import('../views/WalletManager/WalletManager'));

const CricketEarningManager = React.lazy(() => import('../views/EarningManager/CricketEarningManager'));


const Series = React.lazy(() => import('../views/Series/Series'));
const UpdateShortName = React.lazy(() => import('../views/Series/UpdateShortName'));
const PointSystem = React.lazy(() => import('../views/PointSystem/PointSystem'));
const Team = React.lazy(() => import('../views/TeamsManager/Teams'));
const UpdateFlag = React.lazy(() => import('../views/TeamsManager/UpdateFlag'));
const SeriesPlayers = React.lazy(() => import('../views/PlayersManager/SeriesPlayers'));

const SoccerSeries = React.lazy(() => import('../views/SoccerSeries/Series'));
const SoccerUpdateShortName = React.lazy(() => import('../views/SoccerSeries/UpdateShortName'));
//const PointSystem = React.lazy(() => import('../views/PointSystem/PointSystem'));
const SoccerTeam = React.lazy(() => import('../views/SoccerTeamsManager/Teams'));
const SoccerUpdateFlag = React.lazy(() => import('../views/SoccerTeamsManager/UpdateFlag'));
const SoccerSeriesPlayers = React.lazy(() => import('../views/SoccerPlayersManager/SeriesPlayers'));




const CricketCategory = React.lazy(() => import('../views/CricketCategory/CricketCategory'));
const AddCricketCategory = React.lazy(() => import('../views/CricketCategory/AddCricketCategory'));
const EditCricketCategory = React.lazy(() => import('../views/CricketCategory/EditCricketCategory'));

const SoccerCategory = React.lazy(() => import('../views/SoccerCategory/SoccerCategory'));
const AddSoccerCategory = React.lazy(() => import('../views/SoccerCategory/AddSoccerCategory'));
const EditSoccerCategory = React.lazy(() => import('../views/SoccerCategory/EditSoccerCategory'));

const CricketContest = React.lazy(() => import('../views/CricketContest/Contests'));
const UserContests = React.lazy(() => import('../views/CricketContest/UserContests'));
const AddCricketContest = React.lazy(() => import('../views/CricketContest/AddContest'));
const EditCricketContest = React.lazy(() => import('../views/CricketContest/EditContest'));
const ViewCricketContest = React.lazy(() => import('../views/CricketContest/ViewCricketContest'));

const SoccerContest = React.lazy(() => import('../views/SoccerContest/Contests'));
const UserSoccerContests = React.lazy(() => import('../views/SoccerContest/UserContests'));
const AddSoccerContest = React.lazy(() => import('../views/SoccerContest/AddContest'));
const EditSoccerContest = React.lazy(() => import('../views/SoccerContest/EditContest'));
const ViewSoccerContest = React.lazy(() => import('../views/SoccerContest/ViewSoccerContest'));


const TdsDetails = React.lazy(() => import('../views/TdsDetails/TdsDetails'));

const ScheduleContest = React.lazy(() => import('../views/ScheduleContest/ScheduleContest'));
const ScheduleAddContest = React.lazy(() => import('../views/ScheduleContest/ScheduleAddContest'));

const SoccerScheduleContest = React.lazy(() => import('../views/SoccerScheduleContest/ScheduleContest'));
const SoccerScheduleAddContest = React.lazy(() => import('../views/SoccerScheduleContest/ScheduleAddContest'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const fantasyRoutes = [
  { path: '/', exact: true, name: 'Home',module:"Home" },
  { path: '/fantasy-dashboard', name: 'Fantasy Dashboard', component: FantasyDashboard,module:"Dashboard" },

  { path: '/userprofile', name: 'My Profile', component: UserProfile, module:"Dashboard"},
  { path: '/change-password', name: 'Change Password', component: ChangePass ,module:'Dashboard'},

  { path: '/users', name: 'Users', component: Users,module: 'User Management', },
  { path: '/add-user', name: 'Add User', component: AddUser,module: 'User Management', },
  { path: '/edit-user/:id', name: 'Edit User', component: EditUser,module: 'User Management', },

  // { path: '/tokens', name: 'Tokens', component: Tokens,module: 'Tokens', },
  // { path: '/add-token', name: 'Add Token', component: AddToken,module: 'Tokens', },
  // { path: '/edit-token/:id', name: 'Edit Token', component: EditToken,module: 'Tokens', },

  { path: '/sub-admins', name: 'Sub Admins', component: SubAdmins,module: 'Sub Admins', },
  { path: '/add-sub-admin', name: 'Add Sub Admin', component: AddSubAdmin,module: 'Sub Admins', },
  { path: '/edit-sub-admin/:id', name: 'Edit Sub Admin', component: EditSubAdmin ,module: 'Sub Admins',},

  { path: '/update-short-name/:id', name: 'Update Short name', component: UpdateShortName,module:"Cricket" },
  { path: '/edit-flag/:id', name: 'Update Flag', component: UpdateFlag,module:'Cricket' },
  { path: '/tds-details/', name: 'TDS Details', component: TdsDetails,module: 'TDS Details'},

  { path: '/soccer-series-contest', name: 'Series', component: SoccerSeries,module:'Series' },
  { path: '/soccer-update-short-name/:id', name: 'Update Short name', component: SoccerUpdateShortName ,module:'Series' },
  { path: '/soccer-edit-flag/:id', name: 'Update Flag', component: SoccerUpdateFlag,module:'Series'  },
  { path: '/soccer-point-system/', name: 'Point System', component: PointSystem ,module:'Series' },
  { path: '/soccer-tds-details/', name: 'TDS Details', component: TdsDetails,module:'Series'  },

  { path: '/cricket/category', name: 'Cricket Category', component: CricketCategory,module:'Cricket'  },
  { path: '/cricket/add-category', name: 'Add Cricket Category', component: AddCricketCategory,module:'Cricket' },
  { path: '/cricket/edit-category/:id', name: 'Edit Cricket Category', component: EditCricketCategory ,module:'Cricket'},

  { path: '/soccer/category', name: 'Soccer Category', component: SoccerCategory,module:'Soccer Category' },
  { path: '/soccer/add-category', name: 'Add Soccer Category', component: AddSoccerCategory,module:'Soccer Category' },
  { path: '/soccer/edit-category/:id', name: 'Edit Soccer Category', component: EditSoccerCategory,module:'Soccer Category' },

  { path: '/cricket/contests', name: 'Cricket contests', component: CricketContest,module:'Cricket' },
  { path: '/cricket/user-contests', name: 'Cricket / User Contests', component: UserContests,module:'Cricket' },
  { path: '/cricket/add-contest', name: 'Add Cricket Contest', component: AddCricketContest,module:'Cricket' },
  { path: '/cricket/edit-contest/:id', name: 'Edit Cricket Contest', component: EditCricketContest,module:'Cricket' },
  { path: '/cricket/view-contest/:id', name: 'View User Contest', component: ViewCricketContest,module:'Cricket' },

  { path: '/cricket/series', name: 'Series', component: Series,module:'Cricket'},
  { path: '/cricket/mst-teams/', name: 'Teams', component: Team ,module:'Cricket'},
  { path: '/cricket/point-system/', name: 'Point System', component: PointSystem ,module:'Cricket'},
  { path: '/cricket/series-players/', name: 'Series Players', component: SeriesPlayers,module:'Cricket' },
  { path: '/cricket/schedule-contest', name: 'Schedule Contests', component: ScheduleContest ,module:'Cricket'},
  { path: '/cricket/schedule-update-contests/:id', name: 'Schedule Add Contests', component: ScheduleAddContest,module:'Cricket' },

  { path: '/soccer/contests', name: 'Soccer contests', component: SoccerContest,module:'Soccer contests' },
  { path: '/soccer/user-contests', name: 'User Contests', component: UserSoccerContests ,module:'Soccer contests' },
  { path: '/soccer/add-contest', name: 'Add Soccer Contest', component: AddSoccerContest ,module:'Soccer contests'},
  { path: '/soccer/edit-contest/:id', name: 'Edit Soccer Contest', component: EditSoccerContest ,module:'Soccer contests'},
  { path: '/soccer/view-contest/:id', name: 'View User Contest', component: ViewSoccerContest ,module:'Soccer contests'},
  { path: '/soccer/mst-teams/', name: 'Teams', component: SoccerTeam ,module:'Soccer contests'},
  { path: '/soccer/series-players/', name: 'Series Players', component: SoccerSeriesPlayers ,module:'Soccer contests'},
  { path: '/soccer/schedule-contest', name: 'Schedule Contests', component: SoccerScheduleContest,module:'Soccer contests' },
  { path: '/soccer/schedule-update-contests/:id', name: 'Schedule Add Contests', component: SoccerScheduleAddContest,module:'Soccer contests' },

  { path: '/earning', name: 'Earning', component: CricketEarningManager,module:'Earning Manager' },

  { path: '/banners', name: 'Banners', component: Banners,module:'Banners' },
  { path: '/add-banner', name: 'Add Banner', component: AddBanner ,module:'Banners'},
  { path: '/edit-banner/:id', name: 'Edit Banner', component: EditBanner,module:'Banners' },

  { path: '/home-banners', name: 'Home Banners', component: HomeBanners,module:'HomeBanners' },
  { path: '/add-home-banner', name: 'Add Home Banner', component: AddHomeBanner ,module:'HomeBanners'},
  { path: '/edit-home-banner/:id', name: 'Edit Home Banner', component: EditHomeBanner,module:'HomeBanners' },

  { path: '/edit-cricket-banner/', name: 'Edit Cricket Banner', component: EditBottomBanner,module:'BottomBanners' },
  { path: '/edit-web-banner/', name: 'Edit Web Banner', component: EditWebBanner,module:'BottomBanners' },
  { path: '/edit-rummy-banner/', name: 'Edit Rummy Banner', component: EditRummyBanner,module:'BottomBanners' },
  
  // { path: '/edit-bottom-banner/cricket', name: 'Edit Bottom Banner', component: EditBottomBanner,module:'BottomBanners' },
  // { path: '/edit-bottom-banner/web', name: 'Edit Web Banner', component: EditWebBanner,module:'Banners' },
  // { path: '/edit-bottom-banner/rummy', name: 'Edit Rummy Banner', component: EditRummyBanner,module:'Banners' },

  // { path: '/bottom-banners', name: 'Bottom Banners', component: BottomBanners,module:'BottomBanners' },
  // { path: '/add-bottom-banner', name: 'Add Bottom Banner', component: AddBottomBanner ,module:'BottomBanners'},
  // { path: '/edit-bottom-banner/:type', name: 'Edit Bottom Banner', component: EditBottomBanner,module:'BottomBanners' },

  { path: '/faqs', name: 'Faq', component: Faq,module:'Faqs' },
  { path: '/add-faq', name: 'Add Faq', component: AddFaq ,module:'Faqs'},
  { path: '/edit-faq/:id', name: 'Edit Faq', component: EditFaq,module:'Faqs' },

  // { path: '/web-banners', name: 'Web Banners', component: WebBanners },
  // { path: '/edit-web-banner/:id', name: 'Edit Web Banner', component: EditWebBanner },

  // { path: '/news', name: 'News', component: News },
  // { path: '/add-news', name: 'Add News', component: AddNews },
  // { path: '/edit-news/:id', name: 'Edit News', component: EditNews },

  { path: '/coupons', name: 'Coupons', component: Coupons,module:'Coupons' },
  { path: '/add-coupon', name: 'Add Coupon', component: AddCoupon,module:'Coupons' },
  { path: '/edit-coupon/:id', name: 'Edit Coupon', component: EditCoupon,module:'Coupons' },
  { path: '/list-coupon-users/:coupon_code', name: 'Coupon / Users', component: ListCouponUsers, module: 'Coupons' },

  { path: '/static-pages', name: 'Static Pages', component: StaticPages,module:'Static Pages'},
  { path: '/edit-static-pages', name: 'Edit Static Page', component: EditStaticPage,module:'Static Pages' },

  { path: '/email-templates', name: 'Email Templates', component: EmailTemplates,module:'Email Templates' },
  { path: '/edit-email-template', name: 'Edit Email Template', component: EditEmailTemplate,module:'Email Templates' },

  { path: '/notifications', name: 'Notifications', component: Notifications,module:'Notifications' },
  { path: '/transactions', name: 'Transactions', component: Transactions,module:'Transactions' },

  { path: '/wallets', name: 'Wallet Manager', component: WalletManager,module:'Wallet Manager' },
  { path: '/statements/:userId?', name: 'Account Statement', component: AccountStatement,module:'Account Statement' },
  { path: '/withdarwals', name: 'Withdraw Requests', component: WithdrawRequests,module:'Withdraw Request' },
  { path: '/gst-report', name: 'GST Report', component: GSTReport ,module:'Gst Report'},
  { path: '/settings', name: 'Settings', component: Settings,module:'Settings' },
  

];

export default fantasyRoutes;
