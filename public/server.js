const projectName="elab"
const env = 'http://192.168.0.104:8080'
// const env = 'http://192.168.0.163'
// const env = 'https://www.hwznsoft.com'
window.globalUrl = {
  projectName,
  env,
  service: env+'/hwzn_'+projectName,
}
