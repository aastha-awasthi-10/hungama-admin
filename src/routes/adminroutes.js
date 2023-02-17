import React from 'react';

const Dashboard = React.lazy(() => import('../views/Dashboard/Dashboard'));
const GSTReport = React.lazy(() => import('../views/GstReport/GSTReport'));

const UserProfile = React.lazy(() => import('../views/CommanPage/UserProfile'));
const ChangePass = React.lazy(() => import('../views/CommanPage/ChangePass'));


const SubAdmins = React.lazy(() => import('../views/SubAdmin/SubAdmins'));
const AddSubAdmin = React.lazy(() => import('../views/SubAdmin/AddSubAdmin'));
const EditSubAdmin = React.lazy(() => import('../views/SubAdmin/EditSubAdmin'));


const Users = React.lazy(() => import('../views/Users/Users'));
const AddUser = React.lazy(() => import('../views/Users/AddUser'));
const EditUser = React.lazy(() => import('../views/Users/EditUser'));
const UserQuizMatches = React.lazy(() => import('../views/Users/Action/UserQuizMatches'));
const ImportUsers = React.lazy(() => import('../views/Users/ImportUsers'));


const WebBanners = React.lazy(() => import('../views/Banners/WebBanners'));
const EditWebBanner = React.lazy(() => import('../views/Banners/EditWebBanner'));

const Banners = React.lazy(() => import('../views/Banners/Banners'));
const AddBanner = React.lazy(() => import('../views/Banners/AddBanner'));
const EditBanner = React.lazy(() => import('../views/Banners/EditBanner'));

const QuizCategory = React.lazy(() => import('../views/QuizCategory/QuizCategory'));
const AddQuizCategory = React.lazy(() => import('../views/QuizCategory/AddQuizCategory'));
const EditQuizCategory = React.lazy(() => import('../views/QuizCategory/EditQuizCategory'));

const Quizzes = React.lazy(() => import('../views/Quizzes/Quizzes'));
const AddQuiz = React.lazy(() => import('../views/Quizzes/AddQuiz'));
const EditQuiz = React.lazy(() => import('../views/Quizzes/EditQuiz'));

const Questions = React.lazy(() => import('../views/Questions/Questions'));
const AddQuestion = React.lazy(() => import('../views/Questions/AddQuestion'));
const EditQuestion = React.lazy(() => import('../views/Questions/EditQuestion'));
const ImportQuestion = React.lazy(() => import('../views/Questions/ImportQuestion'));

const Contests = React.lazy(() => import('../views/Contests/Contests'));
const AddContest = React.lazy(() => import('../views/Contests/AddContest'));
const EditContest = React.lazy(() => import('../views/Contests/EditContest'));
const ViewWinners = React.lazy(() => import('../views/Contests/Action/ContestWinners'));

const News = React.lazy(() => import('../views/News/News'));
const AddNews = React.lazy(() => import('../views/News/AddNews'));
const EditNews = React.lazy(() => import('../views/News/EditNews'));

const Videos = React.lazy(() => import('../views/Videos/Videos'));
const AddVideos = React.lazy(() => import('../views/Videos/AddVideos'));
const EditVideos = React.lazy(() => import('../views/Videos/EditVideos'));

const Ads = React.lazy(() => import('../views/Ads/Ads'));
const AddAds = React.lazy(() => import('../views/Ads/AddAds'));
const EditAds = React.lazy(() => import('../views/Ads/EditAds'));

const Coupons = React.lazy(() => import('../views/Coupons/Coupons'));
const AddCoupon = React.lazy(() => import('../views/Coupons/AddCoupon'));
const EditCoupon = React.lazy(() => import('../views/Coupons/EditCoupon'));


const QuizEarningManager = React.lazy(() => import('../views/EarningManager/QuizEarningManager'));
const ContestEarningManager = React.lazy(() => import('../views/EarningManager/ContestEarningManager'));

const StaticPages = React.lazy(() => import('../views/StaticPages/StaticPages'));
const EditStaticPage = React.lazy(() => import('../views/StaticPages/EditStaticPage'));

const EmailTemplates = React.lazy(() => import('../views/EmailTemplates/EmailTemplates'));
const EditEmailTemplate = React.lazy(() => import('../views/EmailTemplates/EditEmailTemplate'));

const WalletManager = React.lazy(() => import('../views/WalletManager/WalletManager'));

const Settings = React.lazy(() => import('../views/Settings/Settings'));
const Notifications = React.lazy(() => import('../views/Notifications/Notifications'));
const Transactions = React.lazy(() => import('../views/Transactions/Transactions'));
const AccountStatement = React.lazy(() => import('../views/AccountStatement/AccountStatement'));
const WithdrawRequests = React.lazy(() => import('../views/Withdrawals/WithdrawRequests'));
const QuizMatches = React.lazy(() => import('../views/quizMatches/quizMatches'));
const TdsDetails = React.lazy(() => import('../views/TdsDetails/TdsDetails'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routesAdmin = [
  { path: '/', exact: true, name: 'Home', Module: 'Dashboard'},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, Module: 'Dashboard' },

  { path: '/userprofile', name: 'User Profile', component: UserProfile },
  { path: '/change-password', name: 'Change Password', component: ChangePass },

  { path: '/sub-admins', name: 'Sub Admins', component: SubAdmins, Module: 'Dashboard' },
  { path: '/add-sub-admin', name: 'Add Sub Admin', component: AddSubAdmin, Module: 'Dashboard' },
  { path: '/edit-sub-admin/:id', name: 'Edit Sub Admin', component: EditSubAdmin, Module: 'Dashboard' },

  { path: '/users', name: 'Users', component: Users, Module: 'Users' },
  { path: '/add-user', name: 'Add User', component: AddUser, Module: 'Users' },
  { path: '/edit-user/:id', name: 'Edit User', component: EditUser, Module: 'Users' },
  { path: '/user-quiz-matches/:id', name: 'User Matches', component: UserQuizMatches, Module: 'Users' },
  { path: '/import-users', name: 'Import Users', component: ImportUsers, Module: 'Users' },


  { path: '/banners', name: 'Banners', component: Banners, Module: 'Banners' },
  { path: '/add-banner', name: 'Add Banner', component: AddBanner, Module: 'Banners' },
  { path: '/edit-banner/:id', name: 'Edit Banner', component: EditBanner, Module: 'Banners' },

  { path: '/web-banners', name: 'Web Banners', component: WebBanners, Module: 'Web Banners' },
  { path: '/edit-web-banner/:id', name: 'Edit Web Banner', component: EditWebBanner, Module: 'Web Banners' },

  { path: '/quiz-category', name: 'Quiz Category', component: QuizCategory, Module: 'Quiz Category' },
  { path: '/add-quiz-category', name: 'Add Quiz Category', component: AddQuizCategory, Module: 'Quiz Category' },
  { path: '/edit-quiz-category/:id', name: 'Edit Quiz Category', component: EditQuizCategory, Module: 'Quiz Category' },

  { path: '/quizzes', name: 'Quizzes', component: Quizzes, Module: 'Quizzes' },
  { path: '/add-quiz', name: 'Add Quiz', component: AddQuiz, Module: 'Quizzes' },
  { path: '/edit-quiz/:id', name: 'Edit Quiz', component: EditQuiz, Module: 'Quizzes' },

  { path: '/contests', name: 'Contests', component: Contests, Module: 'Contests' },
  { path: '/add-contest', name: 'Add Contest', component: AddContest, Module: 'Contests' },
  { path: '/edit-contest/:id', name: 'Edit Contest', component: EditContest, Module: 'Contests' },
  { path: '/view-winners/:id', name: 'View Winners', component: ViewWinners, Module: 'Contests' },

  { path: '/questions', name: 'Questions', component: Questions, Module: 'Questions' },
  { path: '/add-question', name: 'Add Question', component: AddQuestion, Module: 'Questions' },
  { path: '/edit-question/:id', name: 'Edit Question', component: EditQuestion, Module: 'Questions' },
  { path: '/import-questions', name: 'Import Question', component: ImportQuestion, Module: 'Questions' },


  { path: '/news', name: 'News', component: News, Module: 'News' },
  { path: '/add-news', name: 'Add News', component: AddNews, Module: 'News' },
  { path: '/edit-news/:id', name: 'Edit News', component: EditNews, Module: 'News' },

  { path: '/videos', name: 'Videos', component: Videos, Module: 'Videos' },
  { path: '/add-video', name: 'Add Video', component: AddVideos, Module: 'Videos' },
  { path: '/edit-video/:id', name: 'Edit Video', component: EditVideos, Module: 'Videos' },

  { path: '/ads', name: 'Ads', component: Ads, Module: 'Ads' },
  { path: '/add-ads', name: 'Add Ads', component: AddAds, Module: 'Ads' },
  { path: '/edit-ads/:id', name: 'Edit Ads', component: EditAds, Module: 'Ads' },


  { path: '/earning/quiz', name: 'Quiz Earning', component: QuizEarningManager, Module: 'Quiz Earning' },
  { path: '/earning/contests', name: 'Contest Earning', component: ContestEarningManager, Module: 'Quiz Earning' },
  { path: '/tds-details/', name: 'TDS Details', component: TdsDetails, Module: 'TDS Details' },

  { path: '/coupons', name: 'Coupons', component: Coupons, Module: 'Coupons' },
  { path: '/add-coupon', name: 'Add Coupon', component: AddCoupon, Module: 'Coupons' },
  { path: '/edit-coupon/:id', name: 'Edit Coupon', component: EditCoupon, Module: 'Coupons' },
  

  { path: '/static-pages', name: 'Static Pages', component: StaticPages, Module: 'Static Pages' },
  { path: '/edit-static-pages', name: 'Edit Static Page', component: EditStaticPage, Module: 'Static Pages' },

  { path: '/email-templates', name: 'Email Templates', component: EmailTemplates, Module: 'Email Templates' },
  { path: '/edit-email-template', name: 'Edit Email Template', component: EditEmailTemplate, Module: 'Email Templates' },

  { path: '/notifications', name: 'Notifications', component: Notifications, Module: 'Notifications' },
  { path: '/transactions', name: 'Transactions', component: Transactions, Module: 'Transactions' },
  { path: '/quiz-matches', name: 'Quiz Matches', component: QuizMatches, Module: 'Quiz Matches' },

  { path: '/wallets', name: 'Wallet Manager', component: WalletManager },
  { path: '/statements/:userId?', name: 'Account Statement', component: AccountStatement, Module: 'Dashboard' },
  { path: '/withdarwals', name: 'Withdraw Requests', component: WithdrawRequests, Module: 'Dashboard' },
  { path: '/settings', name: 'Settings', component: Settings },

  { path: '/gst-report', name: 'GST Report', component: GSTReport,Module:"GST Report" },

];

export default routesAdmin;
