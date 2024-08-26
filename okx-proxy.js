const fs = require('fs');
const path = require('path');
const axios = require('axios');
const colors = require('colors');
const readline = require('readline');
const { HttpsProxyAgent } = require('https-proxy-agent');

class OKX {
    headers() {
        return {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-US,en;q=0.9",
            "App-Type": "web",
            "Content-Type": "application/json",
            "Origin": "https://www.okx.com",
            "Referer": "https://www.okx.com/mini-app/racer?tgWebAppStartParam=linkCode_85298986",
            "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
            "X-Cdn": "https://www.okx.com",
            "X-Locale": "en_US",
            "X-Utc": "7",
            "X-Zkdex-Env": "0"
        };
    }

    async checkProxyIP(proxy) {
        try {
            const proxyAgent = new HttpsProxyAgent(proxy);
            const response = await axios.get('https://api.ipify.org?format=json', {
                httpsAgent: proxyAgent
            });
            if (response.status === 200) {
                return response.data.ip;
            } else {
                throw new Error(`Không thể kiểm tra IP của proxy. Status code: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Error khi kiểm tra IP của proxy: ${error.message}`);
        }
    }

    async postToOKXAPI(extUserId, extUserName, queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/info?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = {
            "extUserId": extUserId,
            "extUserName": extUserName,
            "gameId": 1,
            "linkCode": "85298986"
        };

        const agent = new HttpsProxyAgent(proxy);
        return axios.post(url, payload, { headers, httpsAgent: agent });
    }

    async assessPrediction(extUserId, predict, queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/assess?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = {
            "extUserId": extUserId,
            "predict": predict,
            "gameId": 1
        };

        const agent = new HttpsProxyAgent(proxy);
        return axios.post(url, payload, { headers, httpsAgent: agent });
    }

    async checkDailyRewards(extUserId, queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/tasks?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const agent = new HttpsProxyAgent(proxy);
        try {
            const response = await axios.get(url, { headers, httpsAgent: agent });
            const tasks = response.data.data;
            const dailyCheckInTask = tasks.find(task => task.id === 4);
            if (dailyCheckInTask) {
                if (dailyCheckInTask.state === 0) {
                    this.log('Bắt đầu checkin...');
                    await this.performCheckIn(extUserId, dailyCheckInTask.id, queryId, proxy);
                } else {
                    this.log('Hôm nay bạn đã điểm danh rồi!');
                }
            }
        } catch (error) {
            this.log(`Lỗi kiểm tra phần thưởng hàng ngày: ${error.message}`);
        }
    }

    async performCheckIn(extUserId, taskId, queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/task?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = {
            "extUserId": extUserId,
            "id": taskId
        };

        const agent = new HttpsProxyAgent(proxy);
        try {
            await axios.post(url, payload, { headers, httpsAgent: agent });
            this.log('Điểm danh hàng ngày thành công!');
        } catch (error) {
            this.log(`Lỗi rồi:: ${error.message}`);
        }
    }

    log(msg) {
        console.log(`[*] ${msg}`);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async waitWithCountdown(seconds) {
        for (let i = seconds; i >= 0; i--) {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`===== Đã hoàn thành tất cả tài khoản, chờ ${i} giây để tiếp tục vòng lặp =====`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
    }

    async Countdown(seconds) {
        for (let i = seconds; i >= 0; i--) {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`[*] Chờ ${i} giây để tiếp tục...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
    }

    extractUserData(queryId) {
        const urlParams = new URLSearchParams(queryId);
        const user = JSON.parse(decodeURIComponent(urlParams.get('user')));
        return {
            extUserId: user.id,
            extUserName: user.username
        };
    }

    async getBoosts(queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/boosts?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const agent = new HttpsProxyAgent(proxy);
        try {
            const response = await axios.get(url, { headers, httpsAgent: agent });
            return response.data.data;
        } catch (error) {
            console.log(`Lỗi lấy thông tin boosts: ${error.message}`);
            return [];
        }
    }

    async useBoost(queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/boost?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = { id: 1 };

        const agent = new HttpsProxyAgent(proxy);
        try {
            const response = await axios.post(url, payload, { headers, httpsAgent: agent });
            if (response.data.code === 0) {
                this.log('Reload Fuel Tank thành công!'.yellow);
                await this.Countdown(5);
            } else {
                this.log(`Lỗi Reload Fuel Tank: ${response.data.msg}`.red);
            }
        } catch (error) {
            this.log(`Lỗi rồi: ${error.message}`.red);
        }
    }

    async upgradeFuelTank(queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/boost?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = { id: 2 };
    
        const agent = new HttpsProxyAgent(proxy);
        try {
            const response = await axios.post(url, payload, { headers, httpsAgent: agent });
            if (response.data.code === 0) {
                this.log('Nâng cấp Fuel Tank thành công!'.yellow);
            } else {
                this.log(`Lỗi nâng cấp Fuel Tank: ${response.data.msg}`.red);
            }
        } catch (error) {
            this.log(`Lỗi rồi: ${error.message}`.red);
        }
    }

    async upgradeTurbo(queryId, proxy) {
        const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/boost?t=${Date.now()}`;
        const headers = { ...this.headers(), 'X-Telegram-Init-Data': queryId };
        const payload = { id: 3 };
    
        const agent = new HttpsProxyAgent(proxy);
        try {
            const response = await axios.post(url, payload, { headers, httpsAgent: agent });
            if (response.data.code === 0) {
                this.log('Nâng cấp Turbo Charger thành công!'.yellow);
            } else {
                this.log(`Lỗi nâng cấp Turbo Charger: ${response.data.msg}`.red);
            }
        } catch (error) {
            this.log(`Lỗi rồi: ${error.message}`.red);
        }
    }

    askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }));
    }

    async main() {
        const dataFile = path.join(__dirname, 'id.txt');
        const proxyFile = path.join(__dirname, 'proxy.txt');
        const userData = fs.readFileSync(dataFile, 'utf8')
            .replace(/\r/g, '')
            .split('\n')
            .filter(Boolean);
        const proxyData = fs.readFileSync(proxyFile, 'utf8')
            .replace(/\r/g, '')
            .split('\n')
            .filter(Boolean);
    
        const nangcapfueltank = await this.askQuestion('Bạn có muốn nâng cấp fuel tank không? (y/n): ');
        const hoinangcap = nangcapfueltank.toLowerCase() === 'y';
        const nangcapturbo = await this.askQuestion('Bạn có muốn nâng cấp Turbo Charger không? (y/n): ');
        const hoiturbo = nangcapturbo.toLowerCase() === 'y';

        while (true) {
            for (let i = 0; i < userData.length; i++) {
                const queryId = userData[i];
                const { extUserId, extUserName } = this.extractUserData(queryId);
                const proxy = proxyData[i % proxyData.length];
                try {
                    const proxyIP = await this.checkProxyIP(proxy);
                    console.log(`========== Tài khoản ${i + 1} | ${extUserName} | IP: ${proxyIP} ==========`.blue);
                    await this.checkDailyRewards(extUserId, queryId, proxy);
    
                    let boosts = await this.getBoosts(queryId, proxy);
                    boosts.forEach(boost => {
                        this.log(`${boost.context.name.green}: ${boost.curStage}/${boost.totalStage}`);
                    });
                    let reloadFuelTank = boosts.find(boost => boost.id === 1);
                    let fuelTank = boosts.find(boost => boost.id === 2);
                    let turbo = boosts.find(boost => boost.id === 3);
                    if (fuelTank && hoinangcap) {
                        const balanceResponse = await this.postToOKXAPI(extUserId, extUserName, queryId, proxy);
                        const balancePoints = balanceResponse.data.data.balancePoints;
                        if (fuelTank.curStage < fuelTank.totalStage && balancePoints > fuelTank.pointCost) {
                            await this.upgradeFuelTank(queryId, proxy);
                            
                            boosts = await this.getBoosts(queryId, proxy);
                            const updatedFuelTank = boosts.find(boost => boost.id === 2);
                            const updatebalanceResponse = await this.postToOKXAPI(extUserId, extUserName, queryId, proxy);
                            const updatedBalancePoints = updatebalanceResponse.data.data.balancePoints;
                            if (updatedFuelTank.curStage >= fuelTank.totalStage || updatedBalancePoints < fuelTank.pointCost) {
                                this.log('Không đủ điều kiện nâng cấp Fuel Tank!'.red);
                                continue;
                            }
                        } else {
                            this.log('Không đủ điều kiện nâng cấp Fuel Tank!'.red);
                        }
                    }
                    if (turbo && hoiturbo) {
                        const balanceResponse = await this.postToOKXAPI(extUserId, extUserName, queryId, proxy);
                        const balancePoints = balanceResponse.data.data.balancePoints;
                        if (turbo.curStage < turbo.totalStage && balancePoints > turbo.pointCost) {
                            await this.upgradeTurbo(queryId, proxy);
                            
                            boosts = await this.getBoosts(queryId, proxy);
                            const updatedTurbo = boosts.find(boost => boost.id === 3);
                            const updatebalanceResponse = await this.postToOKXAPI(extUserId, extUserName, queryId, proxy);
                            const updatedBalancePoints = updatebalanceResponse.data.data.balancePoints;
                            if (updatedTurbo.curStage >= turbo.totalStage || updatedBalancePoints < turbo.pointCost) {
                                this.log('Nâng cấp Turbo Charger không thành công!'.red);
                                continue;
                            }
                        } else {
                            this.log('Không đủ điều kiện nâng cấp Turbo Charger!'.red);
                        }
                    }
                    for (let j = 0; j < 50; j++) {
                        const response = await this.postToOKXAPI(extUserId, extUserName, queryId, proxy);
                        const balancePoints = response.data.data.balancePoints;
                        this.log(`${'Balance Points:'.green} ${balancePoints}`);
    
                        const predict = 1;
                        const assessResponse = await this.assessPrediction(extUserId, predict, queryId, proxy);
                        const assessData = assessResponse.data.data;
                        const result = assessData.won ? 'Win'.green : 'Thua'.red;
                        const calculatedValue = assessData.basePoint * assessData.multiplier;
                        this.log(`Kết quả: ${result} x ${assessData.multiplier}! Balance: ${assessData.balancePoints}, Nhận được: ${calculatedValue}, Giá cũ: ${assessData.prevPrice}, Giá hiện tại: ${assessData.currentPrice}`.magenta);
    
                        if (assessData.numChance <= 0 && reloadFuelTank && reloadFuelTank.curStage < reloadFuelTank.totalStage) {
                            await this.useBoost(queryId, proxy);
    
                            boosts = await this.getBoosts(queryId, proxy);
                            reloadFuelTank = boosts.find(boost => boost.id === 1);
                        } else if (assessData.numChance > 0) {
                            await this.Countdown(5);
                            continue;
                        } else if (assessData.secondToRefresh > 0) {
                            await this.Countdown(assessData.secondToRefresh + 5);
                        } else {
                            break;
                        }
                    }
                } catch (error) {
                    this.log(`${'Lỗi rồi:'.red} ${error.message}`);
                }
            }
            await this.waitWithCountdown(60);
        }
    }    
}

if (require.main === module) {
    const okx = new OKX();
    okx.main().catch(err => {
        console.error(err.toString().red);
        process.exit(1);
    });
}
