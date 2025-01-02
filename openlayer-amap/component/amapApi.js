let key = ''
let amapUrl = 'https://restapi.amap.com/v3'
/**
 * 高德输入提示
 * 返回示例
 * {
 *  data: [
 *         {
 *             "id": "B0G2O7IHNW",
 *             "name": "沈阿宝食品店",
 *             "district": "浙江省温州市鹿城区",
 *             "adcode": "330302",
 *             "location": "120.531882,28.089405",
 *             "address": "下巨村108号",
 *             "typecode": "060200",
 *             "city": []
 *         }
 *     ],
 * }
 */
export function searchPOI(keyword,city = '深圳') {
  if(!keyword) {
    return new Promise((resolve,reject) => {
      reject("关键字为空");
    });
  }
  let url = `${amapUrl}/assistant/inputtips?output=json&city=${city}&keywords=${keyword}&key=${key}`;
  return  fetch(url)
    .then(response => response.json())
    .then(data => {
      let res = {data: []}

      if (data.tips && data.tips.length > 0) {
        res.data.push(...data.tips)
      }
      return new Promise((resolve) => {
          resolve(res);
      });
    })
}


/**
 * 高德逆地址解析
 * 返回示例
 * {
 *  data: '某某地址'
 * }
 */
export function getAddressByPoint(location) {
  let url = `${amapUrl}/geocode/regeo?output=json&location=${location}&key=${key}`;

  return  fetch(url)
    .then(response => response.json())
    .then(data => {
      let res = {data: ''}

      if (data.regeocode && data.regeocode.formatted_address) {
        res.data = data.regeocode.formatted_address
      }
      return new Promise((resolve) => {
        resolve(res);
      });
    })
}

