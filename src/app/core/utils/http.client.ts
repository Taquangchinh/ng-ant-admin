import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';
import {NzMessageService} from 'ng-zorro-antd';

/**
 * 封装HttpClient，主要解决：
 * + 优化HttpClient在参数上便利性
 * + 统一实现 loading
 * + 统一处理时间格式问题
 */
@Injectable()
export class NHttpClinet {
  constructor(private http: HttpClient, private message: NzMessageService) {
  }

  private _loading = false;
  /** 是否正在加载中 */
  get loading(): boolean {
    return this._loading;
  }

  parseParams(params: any): HttpParams {
    let ret = new HttpParams();
    if (params) {
      // tslint:disable-next-line:forin
      for (const key in params) {
        let _data = params[key];
        // 将时间转化为：时间戳 (秒)
        if (moment.isDate(_data)) {
          _data = moment(_data).unix();
        }
        ret = ret.set(key, _data);
      }
    }
    return ret;
  }

  private begin() {
    this._loading = true;
  }

  private end() {
    this._loading = false;
  }

  /** 服务端URL地址 */
  get SERVER_URL(): string {
    return environment.SERVER_URL;
  }

  /**
   * GET请求
   *
   * @param {string} url URL地址
   * @param {*} [params] 请求参数
   */
  get(url: string, params?: any): Observable<any> {
    this.begin();
    return this.http
      .get(url, {
        params: this.parseParams(params)
      })
      .do(() => this.end())
      .catch((res) => {
        this.end();
        this.message.error('联网失败，请稍后重试！');
        return res;
      });
  }

  /**
   * POST请求
   *
   * @param {string} url URL地址
   * @param {*} [body] body内容
   * @param {*} [params] 请求参数
   */
  post(url: string, body?: any, params?: any): Observable<any> {
    this.begin();
    return this.http
      .post(url, body || null, {
        params: this.parseParams(params)
      })
      .do(() => this.end())
      .catch((res) => {
        this.end();
        if (res.error.code === '404') {
          this.message.error('请求失败，请重试');
        }
        return res;
      });
  }

  /**
   * PUT请求
   * @param {string} url
   * @param params
   * @returns {Promise<T>}
   */
  put(url: string, params?: any) {
    this.begin();
    return this.http
      .put(url, {
        params: this.parseParams(params)
      })
      .do(() => this.end())
      .catch((res) => {
        this.end();
        return res;
      });
  }

  /**
   * DELETE请求
   *
   * @param {string} url URL地址
   * @param {*} [params] 请求参数
   */
  delete(url: string, params?: any): Observable<any> {
    this.begin();
    return this.http
      .delete(url, {
        params: this.parseParams(params)
      })
      .do(() => this.end())
      .catch((res) => {
        this.end();
        return res;
      });
  }
}
