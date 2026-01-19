import Cookies from 'js-cookie'
export const projectName = window.globalUrl.projectName
export const env = window.globalUrl.env

/**
 * @des 跳转登录页
 */
 export function goLoginPage(localUrl){
  Cookies.remove('token')
  localStorage.removeItem('userInfo')
  let local =false
  if(localUrl.indexOf("192.168.0.104")>0){
    local=true
  }
  window.location.href=(local?env.slice(0,-5)+":8081":"")+"/hwzn-"+projectName+"-client/#/login?response_type=code&redirect_uri="+encodeURIComponent(localUrl)
}

/**
 * @des 跳转前台
 */
 export function goClientPage(localUrl){
  let local =false
  if(localUrl.indexOf("192.168.0.104")>0){
    local=true
  }
  window.location.href=(local?env.slice(0,-5)+":8081":"")+"/hwzn-"+projectName+"-client/#/index"
}

/**
 * @des 转换blob
 */
 export function getBlob(url){
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

/**
 * @des 存储文件
 */
  export function saveAs(blob,filename){
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
  } else {
      const link = document.createElement('a');
      const body = document.querySelector('body');
      let binaryData = [];
      binaryData.push(blob);
      link.href = window.URL.createObjectURL(new Blob(binaryData));
      link.download = filename;
      link.style.display = 'none';
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
  }
}

/**
 * @des 下载文件
 */
 export function downLoadFile(filePath,fileName) {
  const pos=filePath.lastIndexOf('.')
  const name=!fileName?filePath.toLowerCase().slice(0,pos):fileName
  const type=filePath.toLowerCase().slice(pos+1)
  getBlob(filePath).then(blob => {
    saveAs(blob,name+"."+type);
  })
}