const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  logo: state => state.app.logo,
  adminToken: state => state.user.adminToken,
}
export default getters
