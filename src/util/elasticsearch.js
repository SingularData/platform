import { Client } from 'elasticsearch';
import * as HttpAmazonESConnector from 'http-aws-es';
import { get } from 'config';
var currentClient;
export function getClient() {
    if (currentClient) {
        return currentClient;
    }
    if (process.env.NODE_ENV === 'production') {
        var AWS = require('aws-sdk');
        AWS.config.update({
            region: 'us-east-1',
            credentials: new AWS.Credentials(get('elasticsearch.accessKey').toString(), get('elasticsearch.secretKey').toString())
        });
        currentClient = new Client({
            hosts: [get('elasticsearch.host').toString()],
            connectionClass: HttpAmazonESConnector
        });
    }
    else {
        currentClient = new Client({
            host: get('elasticsearch.host')
        });
    }
    return currentClient;
}
export function getSearchParams(text) {
    text = text.trim();
    var params = {};
    var searchKeys = [];
    var searchFields = {};
    var filedName = '';
    var wrapped = false;
    var wordStart = 0;
    for (var i = 0, n = text.length; i < n; i++) {
        if (text[i] === '"') {
            if (wrapped) {
                searchFields[filedName] = text.slice(wordStart, i);
                wrapped = false;
                filedName = '';
                wordStart = i + 2;
                i++;
            }
            else if (text[i - 1] === ':') {
                wrapped = true;
                wordStart = i + 1;
            }
        }
        else if (text[i] === ':') {
            filedName = text.slice(wordStart, i);
            wordStart = i + 1;
        }
        else if (text[i] === ' ') {
            if (filedName && !wrapped) {
                searchFields[filedName] = text.slice(wordStart, i);
                wordStart = i + 1;
                filedName = '';
                wrapped = false;
            }
            else if (!filedName && !wrapped) {
                searchKeys.push(text.slice(wordStart, i));
                wordStart = i + 1;
            }
        }
    }
    if (filedName) {
        searchFields[filedName] = text.slice(wordStart);
    }
    else {
        searchKeys.push(text.slice(wordStart));
    }
    if (searchKeys.length > 0) {
        params.text = searchKeys.join(' ');
    }
    if (Object.keys(searchFields).length > 0) {
        params.fields = searchFields;
    }
    return params;
}
export function getFieldWeight(field) {
    switch (field) {
        case 'name':
            return 4;
        case 'tags':
        case 'categories':
            return 3;
        case 'description':
            return 2;
        default:
            return 1;
    }
}
//# sourceMappingURL=elasticsearch.js.map