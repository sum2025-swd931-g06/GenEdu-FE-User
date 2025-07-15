const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  projectDetail: '/project/:id',
  slideGeneratorDemo: '/slide-generator-demo',
  videoPlayer: '/video/:projectId',
  presentation: '/presentation',
  settings: '/settings',
  notFound: '/404',
  internalServerError: '/500'
} as const
export default path
