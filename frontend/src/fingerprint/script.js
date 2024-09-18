// Get IP address of client in node
/* app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('Client IP:', ip);
  res.send(`Your IP address is ${ip}`);
}); */

class FingerPrint {
  getIP = () => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip)
      .catch(error => error)
  }

  getUA = () => navigator.userAgent

  getBrowser = () => {
    const UA = navigator.userAgent
    let browser = "Unknown"

    if (UA.includes("Chrome") && !UA.includes("Edg")) {
      browser = "Chrome"
    } else if (UA.includes("Firefox")) {
      browser = "Firefox"
    } else if (UA.includes("Safari") && !UA.includes("Chrome")) {
      browser = "Safari"
    } else if (UA.includes("Edg")) {
      browser = "Edge"
    } else if (UA.includes("Opera") || UA.includes("OPR")) {
      browser = "Opera"
    } else if (UA.includes("MSIE") || UA.includes("Trident")) {
      browser = "Internet Explorer"
    }

    return browser
  }

  getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

  getScreenWH = () => {
    return {
      w: Math.round(window.devicePixelRatio * window.screen.width),
      h: Math.round(window.devicePixelRatio * window.screen.height),
      colorDepth: window.screen.colorDepth
    }
  }

  getOS = () => {
    let os = "Unknown OS"
    let arch
    let model
    let osVersion
    if (navigator.userAgentData) {
      navigator.userAgentData.getHighEntropyValues(['architecture', 'model', 'platformVersion'])
        .then(ua => {
          os = ua.platform
          arch = ua.architecture
          model = ua.model
          osVersion = ua.platformVersion
        })
    } else {
      const userAgent = navigator.userAgent
      const platform = navigator.platform;

      if (platform.includes('Win')) {
        os = 'Windows'
        if (userAgent.includes('x64') || userAgent.includes('wow64')) {
          arch = 'x64'
        } else {
          arch = 'x86'
        }
      } else if (platform.includes('Mac')) {
        os = 'MacOS'
        arch = 'x64'
      } else if (platform.includes('Linux')) {
        os = 'Linux'
        if (userAgent.includes('x86_64')) {
          arch = 'x64'
        } else {
          arch = 'x86'
        }
      } else if (/Android/.test(userAgent)) {
        os = 'Android'
        if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
          arch = 'ARM64'
        } else {
          arch = 'ARM'
        }
      } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        os = 'iOS'
        arch = 'ARM'
      }
    }

    return { os, arch, model, osVersion }
  }

  getLocation = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })

      if (permissionStatus.state !== 'granted') {
        return { latitude: null, longitude: null }
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      return {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
    } catch (error) {
      return { lat: null, lon: null }
    }
  }

  getHTTPHeaders = async () => {
    try {
      const response = fetch('https://example.com')
      const headers = {}
      if (response.headers) {
        response.headers.forEach((value, key) => {
          headers[key] = value
        })
      }
      return headers
    } catch (error) {
      return null
    }
  }

  areCookiesEnabled = () => {
    document.cookie = "testcookie=yes; SameSite=Lax; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"
    const cookiesEnabled = document.cookie.indexOf("testcookie=yes") !== -1
    document.cookie = "testcookie=; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
    return cookiesEnabled
  }


  checkDoNotTrack = () => {
    const doNotTrack = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;

    if (doNotTrack === '1' || doNotTrack === 'yes') {
      return true
    } else {
      return false
    }
  }

  hasTouchscreen = () => {
    return navigator.maxTouchPoints > 0 || 'ontouchstart' in window
  }

  getPlugins = () => {
    try {
      const plugins = navigator.plugins;
      let pluginList = [];

      for (let i = 0; i < plugins.length; i++) {
        pluginList.push(plugins[i].name);
      }

      return pluginList;
    } catch (error) {
      return []
    }
  }


  fingerprint = () => {
    const f = {
      IP: this.getIP(),
      UA: this.getUA(),
      Bowser: this.getBrowser(),
      Timezone: this.getTimeZone(),
      OS: this.getOS(),
      Cookies: this.areCookiesEnabled(),
      DONotTrack: this.checkDoNotTrack(),
      TouchScreen: this.hasTouchscreen(),
      plugins: this.getPlugins(),
      Screen: this.getScreenWH(),
      Location: this.getLocation().then(r => r),
      HTTPHeaders: this.getHTTPHeaders().then(r => r),
    }

    let result
    fetch('/api/fingerprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(f)
    }).then(response => response.json())
      .then(data => result = data)
      .catch(error => result = error)

    return result
  }
}

// test
/* const fingerprint = async () => {
  try {
    const f = new FingerPrint()
    const result = f.fingerprint()
    console.log(result)
  } catch (error) {
    console.log(error)
  }
} */
