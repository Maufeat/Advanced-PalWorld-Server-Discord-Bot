import { v4 } from 'uuid';

export default class EOSClient {

    private _base_url = 'https://api.epicgames.dev/';
    private _oauth_url = 'auth/v1/oauth/token';
    private _client_id = "xyza78916PZ5DF0fAahu4tnrKKyFpqRE";
    private _client_secret = "j0NapLEPm3R3EOrlQiM8cRLKq3Rt02ZVVwT0SkZstSg";
    private _deployment_id = "0a18471f93d448e2a1f60e47e03d3413";

    private _user_agent: string = 'EOS-SDK/1.15.3-21924193 (Windows/10.0.22621.2361.64bit) Pal/++UE5+Release-5.1-CL-0';
    private _eos_version: string = '1.15.3-21924193';
    private _epic_correlation_id: string = 'EOS-' + v4();

    getStandardEOSHeader() {
        return {
            'X-Epic-Correlation-ID': this._epic_correlation_id,
            'User-Agent': this._user_agent,
            'X-EOS-Version': this._eos_version
        }
    }

    async getDeviceAccessToken() {
        let response = await fetch(this._base_url + 'auth/v1/accounts/deviceid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json",
                'Authorization': 'Basic ' + btoa(this._client_id + ':' + this._client_secret),
                ...this.getStandardEOSHeader()
            },
            body: new URLSearchParams({
                'deviceModel': 'PC'
            })
        });
        let data = await response.json();
        return data.access_token;
    }

    async getAuthId() {
        let deviceAccessToken = await this.getDeviceAccessToken();
        let response = await fetch(this._base_url + this._oauth_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json",
                'Authorization': 'Basic ' + btoa(this._client_id + ':' + this._client_secret),
                ...this.getStandardEOSHeader()
            },
            body: new URLSearchParams({
                'grant_type': 'external_auth',
                'deployment_id': this._deployment_id,
                'external_auth_type': 'deviceid_access_token',
                'external_auth_token': deviceAccessToken,
                'display_name': 'User',
                'nonce': this.generateNonce(22),
            })
        });
        let data = await response.json();
        return data.access_token;
    }

    generateNonce(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }

        return randomString;
    }

    public async queryMatchmaking(query: any, maxResults: number = 100) {
        let response = await fetch(this._base_url + 'matchmaking/v1/0a18471f93d448e2a1f60e47e03d3413/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': 'Bearer ' + await this.getAuthId(),
                ...this.getStandardEOSHeader()
            },
            body: JSON.stringify({
                "criteria": query,
                "maxResults": maxResults,
                "sortBy": {}
            })
        })
        let data = await response.json();
        return data;
    }
}
