const axios = require('axios');

const config = {
  method: 'get', // change to 'post' if the original request is POST
  url: 'https://www.okx.com/priapi/v1/affiliate/game/racer/boosts?t=1724892936228',
  headers: { 
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9',
    'app-type': 'web',
    'cookie': 'devId=45cef81b-3aba-4e0d-90d5-b21f55b26a75; ok_site_info===QfxojI5RXa05WZiwiIMFkQPx0Rfh1SPJiOiUGZvNmIsIiTWJiOi42bpdWZyJye; ok_prefer_udColor=0; ok_prefer_udTimeZone=0; browserVersionLevel=v5.6ad2a8e37c01; okg.currentMedia=sm; _ym_uid=1721873212108493678; _ym_d=1721873212; ok-exp-time=1724891748040; fingerprint_id=45cef81b-3aba-4e0d-90d5-b21f55b26a75; _gid=GA1.2.1935133927.1724891751; locale=en_US; ok_prefer_currency=%7B%22currencyId%22%3A0%2C%22isDefault%22%3A1%2C%22isPremium%22%3Afalse%2C%22isoCode%22%3A%22USD%22%2C%22precision%22%3A2%2C%22symbol%22%3A%22%24%22%2C%22usdToThisRate%22%3A1%2C%22usdToThisRatePremium%22%3A1%2C%22displayName%22%3A%22USD%22%7D; __cf_bm=D2D957N3rM82Xv.VhkbOxlCxOk6RcoczEVdwZnGeF_o-1724892927-1.0.1.1-6PgKHbr0ZXuE5iJR6UhAG8lQibEcG6FC1s_Lk_t0L4pOfHz3D.LuNjYScz7rMf25o5poqpey8XM5WbUniOMboA; amp_56bf9d=45cef81b-3aba-4e0d-90d5-b21f55b26a75...1i6douo2l.1i6dq2lcm.2g.0.2g; _gat_UA-35324627-3=1; _ga=GA1.1.1877557691.1721873079; _ga_G0EKWWQGTZ=GS1.1.1724891750.8.1.1724892927.60.0.0; _monitor_extras={"deviceId":"yxtSbebQE5RkdYiIcA5x3G","eventId":96,"sequenceNumber":96}; ok-ses-id=j+8OjHgE+55ePRHy5thKUTOCqcDFdo1jlMOOJVK2IwBw17U0YA52APNTvNEzFuPJVdHC6mPWwR9EM16I6RUCcUhn+cuHknE8bBfHmwHQUdgSIdJakKkC+erdvkwPQGV6; traceId=2120148929314610001',
    'devid': '45cef81b-3aba-4e0d-90d5-b21f55b26a75',
    'priority': 'u=1, i',
    'referer': 'https://www.okx.com/mini-app/racer/tasks',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128", "Microsoft Edge WebView2";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
    'x-cdn': 'https://www.okx.com',
    'x-id-group': '2140848929270000004-c-9',
    'x-locale': 'en_US',
    'x-site-info': '==QfxojI5RXa05WZiwiIMFkQPx0Rfh1SPJiOiUGZvNmIsIiTWJiOi42bpdWZyJye',
    'x-telegram-init-data': 'query_id=AAGymGx5AgAAALKYbHlGW18n&user=%7B%22id%22%3A6332127410%2C%22first_name%22%3A%22Night%22%2C%22last_name%22%3A%22Fury%22%2C%22username%22%3A%22phuongtrungduc%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724892926&hash=9950e5488d7bee393a62cdd98317c57a77289111874a152cc36b8e6e549b0a2f',
    'x-utc': '7',
    'x-zkdex-env': '0'
  }
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
});
