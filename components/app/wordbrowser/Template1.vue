<template>
<div class="container-xxl">
  <div class="bd-content ps-lg-4">
  <header class="py-3 mb-3 border-bottom">
    <div class="container-fluid d-grid gap-3 align-items-center" style="grid-template-columns: 1fr 2fr;">
      <div class="dropdown">
        <a @click="ddm_onclick()" class="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none dropdown-toggle" id="dropdownNavLink" data-bs-toggle="dropdown" aria-expanded="false"> 單字瀏覽  </a>
        <ul class="dropdown-menu text-small shadow" v-bind:class="{ show: ddm_sub_show }" aria-labelledby="dropdownNavLink">
          <li><a class="dropdown-item" v-bind:class="{ active: ddm_index === 0 }" @click="ddm_sub_onclick(0)">全部</a></li>
          <li><a class="dropdown-item" v-bind:class="{ active: ddm_index === 1 }" @click="ddm_sub_onclick(1)">字首</a></li>
          <li><a class="dropdown-item" v-bind:class="{ active: ddm_index === 2 }" @click="ddm_sub_onclick(2)">字根</a></li>
          <li><a class="dropdown-item" v-bind:class="{ active: ddm_index === 3 }" @click="ddm_sub_onclick(3)">字尾</a></li>
        </ul>
      </div>

      <div class="d-flex align-items-center">
        <div class="w-100 me-3">
          <input type="search" v-model="query" @keyup.enter="query_oninput" class="form-control" placeholder="Search..." >
        </div>
      </div>
    </div>
  </header>
  
  <div class="container-fluid pb-2">
    <div class="d-grid gap-2" style="grid-template-columns: 0.5fr 2fr;">
      <div class="bg-loading text-primary" v-bind:class="{ loading: loading }">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="bg-light border rounded-1">
        <ul class="list-group">
          <li v-for="(w, i) in words" class="list-group-item" v-bind:class="{ active: word_index === i }" @click="word_onclick(i)">{{ w.word }}</li>
        </ul>
      </div>
      <div v-for="(w, i) in words" class="bg-w bg-light border rounded-1" v-bind:class="{ 'bg-active': word_index === i }">		
        <div v-if="word_index === i" class="py-2 text-xs-left mb-2 px-4">
          <p class="text bold xlarge word--text"> {{ w.word }}
            <span class="icon icon rounded thin large ml-3" @click="playaudio(i)">
              <i class="fa fa-volume-up clickable"></i> 
            </span>
          </p>
          <p class="text xsmall" v-if="w.dictionary.kk.length > 0">[{{w.dictionary.kk}}]</p>
          <p class="text bold my-1">{{ w.dictionary.definition }}</p>
          <div class="layout external-dictionary my-3 align-center">
            <a :href="'http://www.dictionary.com/browse/' + w.word" target="_blank" title="英文字典 (Dictionary)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QUCBTcnQOPyyAAAAkZJREFUKM+Nkk1IVFEYhr9z7m1m/BtHJ7RRGw1L3IwKUZaaWVRQYSVBJEiWi7KyIqGNEEVEEkEhGBS16m9hYA0RiRRWYyEIpmYTEv5iYeFkOuq953znu7dFu3AxL8/yfXYPO9U+9CIcYRDTqnJd+thvERUU2x/ehyc4U0oJCaiYUhqp4ox4G5VGqsKfyJT6H7I4IdZv8J7YmKYpgcLcnuWsLfAYS0Z1YSpfmrNRkDAtKQAFoABCLX93zfP+6YnRyWBDWdQQ9z5OejU8U55zru1zd+OWyKI8FFhZmJEwuyAiUSOFGWzvzc6ekYgNQJa9WjeCTQcaHvd+HZtub9zp4mzr6duziekKVeuxkpeDUz9nIjooJGHUVeS9Gfo+s+AoaHpWlAJdF6t+zRvFDffd/nWV+empCa6rHcOGoLXxFgdCzcLWtndr7PknR9f3Xq4sLco9eKsj9KHP7VsFKJ6e3TUyMBCs38SVaZPUmUKGwp2c1P3DCLW8JrLMP7N7Ar6BkUWGggF0hj71zZBT10CazGXpNqGNEgA8Cc5rRyp8qYnZ6W6fN7kj1P/qztu8TI8iq7+ldv/xZh7vA6V0rogrBID5OTx5o43rK4BrAKzpcIlDLg6Pi5orD4DrDm8aV5JbFgeSgOY/NI0zmxhJRqL5Udf1um2Xqkv9Of4dZYWjD887IlOgiO27cLfny/iyIdgATrCcMmpKiY4kcLiyPZoOhIBiWYEBSADJ4sAZB2ADCiBdB4UMMcb4gJheHsj6Fh5kLKbAN+dl/gW1qDHIWadz0wAAAABJRU5ErkJggg=="></a>
            <a :href="'http://www.thesaurus.com/browse/' + w.word" target="_blank" title="同反義字 (Thesaurus)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QUCBTYZmJneIgAAAkBJREFUOMulk01IlFEUhp9z7+cozoRK5n+aqQ3mQpKymIQkglwkRYXQIoIIEvqBVm1aBQaBqwiCti4y+qUykNoEpbQooRa1MNQpSM3wb3TG+ea7t8U1VHTngbM5h/vc99z7HvF7ay2bCMUmY2OAKJdrahqQDQCilpurDvsJl+Kt1JemAbMOokjPuqYoUB74C0hpK1LcAslxBxcPVd+5DDRrAbq1B6k5A0szkJ4FpcFk0LE7SPQCJCfBn0NKDqIaLkPqL+hsp8QalPnxAFXTgW7rQ8qPQpDG/uwj8/YUancnan83ZBYIBq4ile1ISQt2dhhMGnQO4vcUWRCk6riTmVnEfLuHHX0OXhh95DGIJnhzAik7jGq8jv39DimOgQjiP4xaRJx80Uj1aVT0PCxNY750Y+Iv0bG7SHEM8/0+et8tzOgz7MhTbGoK8XtrLUEKgpT71SAJoQJU3Vlk1zlIxAkGr6F2dqCabhC8bsNOfIDsfHeh/2SP1Xu7sP4cdvIjTH/Fzg1j58eQUD6q4RKy4xRkF2CGurAjjyBcDsYHaxG/t85KfhTZ1oxsbYTccrAGuxCHP58w8RdIpArVfJugvx10FtgV93tgsVND2IkBN0JOIZJXhxQ2IUUH0NUnkXAFZvw9BIugC4BgNQDIyoXQFgjSkBzHJEYh/or/LlUNV1Clh8CadVZ2AIt7vHAFqv4ieGEI5SFZEWeYcJmreRGwwQbLJM5V4kUgvN3ZNTGGmRjE/OrHfL4J6Rmk8hj482sW7R9km9XXAbAPJQAAAABJRU5ErkJggg=="></a>
            <a :href="'https://www.etymonline.com/word/' + w.word" target="_blank" title="字源字典 (Etymonline)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMTcxQUYwQTlCQTUxMUUxODQxNUNDNEFEQkY2RkNFOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMTcxQUYwQjlCQTUxMUUxODQxNUNDNEFEQkY2RkNFOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkRBOUJFMUZGOUI1NTExRTE4NDE1Q0M0QURCRjZGQ0U4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRBOUJFMjAwOUI1NTExRTE4NDE1Q0M0QURCRjZGQ0U4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EzbyBgAAAVRJREFUeNpiLGBQYCAFsMBZEg46NumhEDYnH8+FLQcuT9+MqYHZgkEASCmH2WYu7b2y//i2jJ5raw8IGyiFNxX84mV+sPsMdg25u2Z++fBxqV8ZRBSoTj3Q1tzf9eLh418evELWwATEupm+AmLCV/efQJa4vOcYkDSO9ESzAaRBzkAD061v7j8Fkqrm+rFbe/POLQL6EKHh28fPEI9ianty/e76wu73z1/LW+kjNFzfdgRIatmZISuFWPv48q0vt14s9i7+9v4TQsOLA1eOrdkO9IZjVwZElEdNwsTP5frRsyfblgKdBPISLIih8bAmsv77py+mAa7CspJAhqad6b/fv398/QZULSgpij3itqZ3b4VzZpY6J4VuaJ8JNDhkeSN6KOEHQMsh6YBYDRAv+TbmoDsJDoDxqGyqC2RYRHhDwsrYx+n+hWsQWUZSUysTA4kAIMAAOwV9grSuPMUAAAAASUVORK5CYII="></a>
            <a :href="'https://dictionary.cambridge.org/zht/詞典/英語-漢語-繁體/' + w.word" target="_blank" title="中文例句 (Cambridge)"><img src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDvLj/kY+L/5GPi//MxMD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+1tv8uLqD/hIr/////9P////b/hIr//zc5mf/MwcD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBbiP8AM8z/ADPM/4SK///59uP/tqms/4SK//8AM8z/ADPM/29iiP8AAAAAAAAAAAAAAAAAAAAAAAAAAFRWiv8AM8z/IYrG/xRqt/+Eiv//tqms//fz5f+Eiv//G06+/yWIzP8AM8z/WF9+/wAAAAAAAAAAAAAAAJqPmv8AM8z/IKvR/zWuw/8ag83/hIr////86/+2qaz/hIr//xl3zf8krcr/LrPH/wAzzP+aj5j/AAAAAAAAAABmbo//H6fl/y2juv8iksv/E1y4/4SK//+2qaz///bs/4SK//8SkM//Lp64/ySWy/8leNr/Zm6P/wAAAAAAAAAANDyW/wAzzP8Ufcb/G1e6/wcrxP+Eiv/////p////7P+Eiv//Biy8/xR8xv8fU8D/ADPM/zQ8lv8AAAAAAAAAAF1Zpf+Eiv//hIr//4SK//+Eiv//a3rS/7O0v/+rsbv/cn/Z/4SK//+Eiv//hIr//4SK//9dXaL/AAAAAAAAAACRj4v///7y/9HMwv/y7uP////f/5KT1v8TLtX/EinN/6el5P///+b/8e3i/8/MwP////P/kY+L/wAAAAAAAAAAkY+L///////q6OD/29bT///74v93frj/DTTS/w0uy/+Ji8L////s/9nV0P/r6OL//////5GPi/8AAAAAAAAAAFFWnv+Eiv//hIr//4SK//+Eiv//g4vi/8DIxf++xcP/hY3o/4SK//+Eiv//hIr//4SK//9UV5v/AAAAAAAAAAAyOpv/ADPM/wAzzP8UNb//D0G9/4SK//////D/6efV/4SK//8AM8z/FjTE/wAzzP8AM8z/M0iP/wAAAAAAAAAATkmS/yen8f80ncD/JK/R/xV+wv+Eiv//5d7O//n55v+Eiv//ADPM/yKqz/81osL/Jbzp/05Jkv8AAAAAAAAAAEZWg/8jcNv/L6S+/zSTuf8WYsb/hIr///r25f/o3tP/hIr//xRKxv8uoLz/M568/yVi3f9GVoP/AAAAAAAAAAAzQ5T/M5P3/yCX2P8xaNj/ADPM/4SK//////L////0/4SK//8lcOP/L4Xo/yJ80P8AM8z/M0OU/wAAAAAAAAAAS0Z0/zNDlP9IXo//R1uP/zlMh/9eX6D/q6ed/6mnnf9bWqD/PkSP/0hdkP9IW4//M0OU/0tGdP8AAAAA/D8AAPAPAADgB8MAwAMAAIABApOAAQAAgAEAAIAB/wCAAQAAgAEAAIAB//+AAf//gAH/AIABAACAAQAAgAH/AA=="></a>
            <a :href="'https://tw.dictionary.search.yahoo.com/search?q=' + w.word" target="blank" title="中文字典 (Yahoo)"><img src="data:image/x-icon;base64,AAABAAEAICAAAAEACACoCAAAFgAAACgAAAAgAAAAQAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSAWAA0gJhANIDYQDSBGIA0gVjANMHZADTCWUA0wtmANQMZwDUDWgA1BBpANURagDVE2sA1RRsANYbcADXHnIA1yBzANgkdgDZKXkA2St6ANoufADaMH0A2zaBANw5gwDcO4QA3UGIAN9LjgDfTI8A4FCRAOBSkwDgVJQA4ViWAOFZlwDiXJkA5GuiAOVsowDlb6UA5XClAOd4qgDneasA6H6uAOiArwDogrEA6oi0AOqMtwDrkrsA7JS8AOyVvADslr0A7ZrAAO2cwQDuocQA7qLFAO6kxgDvqMgA8KvKAPCtywDyuNIA8rrTAPO+1gD0wtgA9MTaAPTG2wD1yNwA9s7gAPbP4QD31OQA99XkAPfX5gD42ecA+NvoAPnf6wD54ewA+uTuAPrl7gD87vQA/PD1APzx9gD88vYA/fT4AP31+AD99vkA/vr7AP77/AD+/P0A/v39AP7+/gD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0V1dXOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVXV1dUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtXV1csAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1dXV0wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdV1dXVyIAAAcwSEEfAAAAAAAAAAAAAAAAAAAAAAAAAD1XV1dXRQAAL1dXV1YYAAAAAAAAAAAAAAAAAAAAAAAWV1dXV1dXGgBDV1dXVyoAAAAAAAAAAAAAAAAAAAAAADZXV1dXV1c6ADNXV1dXIAAAAAAAAAAAAAAAAAAAAAAPU1dXU05XV1cTDTlWUy0AAAAAAAAAAAAAAAAAAAAAACxXV1c3LVdXVzEAAAkFAAAAAAAAAAAAAAAAAAAAAAAJTVdXVxkSV1dXUQwGRkZGRjEAAAAAAAAAAAAAAAAAACVXV1dEAAA7V1dXJwA8V1dXVREAAAAAAAAAAAAAAAACR1dXVyQAAB5XV1dJAxxXV1dXLgAAAAAAAAAAAAAAAB5XV1dQCgAAA0pXV1cfAUZXV1dPCwAAAAAAAAAAAAAAPldXVzIAAAAAKVdXVz8AI1dXV1cmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHS1dXV0oEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArV1dXVyEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5SV1dXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVXV1dXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFEJCQkIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"></a>
            <a :href="'https://terms.naer.edu.tw/search/?q=' + w.word" target="_blank" title="學術名詞 (NAER) "><img src="https://www.naer.edu.tw/assets/favicons/icon_Favicon_NAER_PNG.PNG"></a>
            <a :href="'https://google.com/search?q=' + w.word" target="_blank" title="網路搜尋 (Google)"><img src="https://www.google.com/favicon.ico"></a>
          </div>
          <div class="layout pl-3 align-center justify-start">
            <p class="text small my-4" v-if="hasPrefix(i) || hasSuffix(i)"><span class="text">
              {{ w.word }}
              <i aria-hidden="true" class="material-icons icon mx-2">arrow_forward</i>
              <span class="e4f-v1 text">
                <span class="plus-container" v-if="hasPrefix(i)">
                  <a class="prefix--text">{{showPrefix(i)}}</a> 
                  <span class="plus-sign text"> + </span>
                </span>
                <span class="plus-container" v-if="hasMean(i)">
                  <a class="word--text">{{showMean(i)}}</a> 
                  <span class="plus-sign text" v-if="hasSuffix(i)"> + </span>
                </span>
                <span class="plus-container" v-if="hasSuffix(i)">
                  <a class="suffix--text">{{showSuffix(i)}}</a> 
                </span>
              </span>
            </span></p>
          </div>
          
          <div class="warp-exit"><div class="layout column justify-center">
            <div class="decomposition mx-3" color="prefix" v-if="hasPrefix(i)">
              <div class="layout row">
                <div class="flex type lighten prefix"><div class="layout column align-center justify-center fill-height">首</div></div>
                <div class="flex content prefix"><div class="layout row justify-space-between align-center fill-height">
                  <div class="flex"><a class="white--text topic">{{showPrefix(i)}}</a><p>{{showPrefixMean(i)}}</p></div>
                </div></div>
              </div>
            </div>
            <div class="decomposition mx-3" color="word" v-if="hasMean(i)">
              <div class="layout row">
                <div class="flex type lighten word"><div class="layout column align-center justify-center fill-height">字</div></div>
                <div class="flex content word"><div class="layout row justify-space-between align-center fill-height">
                  <div class="flex"><a class="white--text topic word--text">{{showMean(i)}}</a><p>{{ w.dictionary.definition }}</p></div>
                </div></div>
              </div>
            </div>
            <div class="decomposition mx-3" color="suffix" v-if="hasSuffix(i)">
              <div class="layout row">
                <div class="flex type lighten suffix"><div class="layout column align-center justify-center fill-height">尾</div></div>
                <div class="flex content suffix"><div class="layout row justify-space-between align-center fill-height">
                  <div class="flex"><a class="white--text topic">{{showSuffix(i)}}</a><p>{{showSuffixMean(i)}}</p></div>
                </div></div>
              </div>
            </div>
          </div></div>
          
        </div>
      </div>
    </div>
  </div>
  
  <svg width="500" height="400"></svg>

  </div>
</div>
</template>

<script>
import axios from 'axios';
import * as d3 from "d3";

var ddm_sub_show = false;
var ddm_index = 0;
var loading = true;
var query = 'a';
var words = [];
var word_index = 0;
var w1 = { word: '', dictionary: { definition: '' }};
var audio = [];
var SSU;
var version;
export default {
  data(){ 
    ddm_sub_show = false;
    ddm_index = 0;
    query = 'a';
    loading = true;
    words = [];
    word_index = 0;
    w1 = { word: '', dictionary: { definition: '' }};
    
    function d3tree( _data ) {
        var treeData = {
          name: _data.word,
          children: []
        };
        for(var i = 0; i < _data.subs.length; i++) {
          var w = _data.subs[i]; 
          var item = { name: w.word, children: [] };
          if(w.subs.length > 0) {
            for(var j = 0; j < w.subs.length; j++) {
              var ws = w.subs[j];
              var subitem = { name: ws.word, children: [] };
              if(ws.subs.length > 0) { 
                for(var k = 0; k < ws.subs.length; k++) {
                  subitem.children.push({ name: ws.subs[k].word });
                }
              } 
              item.children.push(subitem);
            }
          } 
          treeData.children.push(item);
        }
        
        const tree = data => {
          const root = d3.hierarchy(data);
          root.dx = 50;
          root.dy = 100;
          return d3.tree().nodeSize([root.dx, root.dy])(root);
        }
        // 將資料轉為tree的格式
        const root = tree(treeData);

        const svg = d3.select('svg').attr('width', 500).attr('height', 400);
        svg.selectAll("g").remove();
        const g = svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 14)
              .attr("transform", `translate(100, 100)`);

        // link是點跟點連線的灰色線條
        const link = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
              .attr("d", d3.linkHorizontal()
                  .x(d => d.y)
                  .y(d => d.x));
                  
        // 這部分是畫上圓圈的部分，透過`descendants`推測出目前資料的`x, y`位置。
        const node = g.append("g")
              .attr("stroke-linejoin", "round")
              .attr("stroke-width", 3)
              .selectAll("g")
              .data(root.descendants())
              .join("g")
              .attr("transform", d => `translate(${d.y},${d.x})`)
              .classed('node-text', true);
              //.each(data => console.log('data', data));
              
        node.append("circle")
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children ? -6 : 6)
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");  
    
    }
    
    return {
      ddm_sub_show,
      ddm_index,
      query,
      loading,
      words,
      word_index,
      w1,
      version,
      d3tree
    }
  },
  mounted() {
    this.loading = true;
    this.word_index = 0;
    this.words = [];
    this.d3tree({ words:'', subs: [] });
    
    axios.post(
      `/api/data_wordbrowser`
      , {
        page: 1,
        query: 'a'
      })
      .then( (resp) => {
        this.loading = false;
        this.word_index = 0;
        this.words = resp.data;
        this.d3tree(this.words[0]);
      })
      .catch( (error) => {
        this.loading = false;
        console.log(error);
      });
  },
  watch: {
    query: function(newVal, oldVal) { 
      this.loading = true;
      this.word_index = 0;
      this.words = [];
      this.w1 = { word: '', subs:[], dictionary: { definition: '' }};
      this.d3tree(this.w1);
      axios.post(
        `/api/data_wordbrowser`
        , {
          page: 1,
          query: newVal
        })
         .then( (resp) => {
          this.loading = false;
          this.word_index = 0;
          this.words = resp.data;
          this.w1 = JSON.parse(JSON.stringify(this.words[this.word_index]));
          this.d3tree(this.w1);
         })
         .catch( (error) => {
          this.loading = false;
          console.log(error);
         });
		
    }
  },
  methods: {
    ddm_onclick: function() {
      this.ddm_sub_show = !this.ddm_sub_show;
    },    
    ddm_sub_onclick: function(i) {
      this.ddm_index = i;
      this.ddm_sub_show = false;
    },
    word_onclick: function(i) {
      this.word_index = i;
      this.w1 = JSON.parse(JSON.stringify(this.words[this.word_index]));
      this.d3tree(this.w1);
    },
    show_word: function() {
      return (this.words) ? JSON.stringify(this.words[this.word_index], undefined, 2) : '';
    },
    playaudio: function(i) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.words[i].word));
    },
    hasPrefix: function(i) {
      return this.words[i].prss.filter(x => x.type === 'p').length > 0 || this.words[i].prss.filter(x => x.type === 'r').length > 0;
    },
    hasMean: function(i) {
      return this.words[i].prss.filter(x => x.type === 'p').length > 0 || this.words[i].prss.filter(x => x.type === 'r').length > 0 || this.words[i].prss.filter(x => x.type === 's').length > 0;
    },
    hasSuffix: function(i) {
      return this.words[i].prss.filter(x => x.type === 's').length > 0 ;
    },
    showPrefix: function(i) {
      if(this.words[i].prss.filter(x => x.type === 'p').length > 0)
        return this.words[i].prss.filter(x => x.type === 'p')[0].key;
      else if(this.words[i].prss.filter(x => x.type === 'r').length > 0)
        return this.words[i].prss.filter(x => x.type === 'r')[0].key;
      else 
        return '';
    },
    showMean: function(i) {
      var mean = this.words[i].word;
      var temp = '';
      if(this.words[i].prss.filter(x => x.type === 'p').length > 0) { 
        temp = this.words[i].prss.filter(x => x.type === 'p')[0].key; 
        while(temp.length > 1) {
          temp = temp.replace('-','');
          var reg = new RegExp('^' + temp);
          if(mean.match(reg) !== null) {
            mean = mean.replace(reg, '');
            break;
          }
          temp = temp.substr(0, temp.length - 1);
        }
      }
      temp = temp.replace('-','');
      var reg = new RegExp('^' + temp);
      if(mean.match(reg) !== null) { mean = mean.replace(reg, ''); }
      
      if(this.words[i].prss.filter(x => x.type === 'r').length > 0) { 
        temp = this.words[i].prss.filter(x => x.type === 'r')[0].key; 
        while(temp.length > 1) {
          temp = temp.replace('-','');
          var reg = new RegExp('^' + temp);
          if(mean.match(reg) !== null) {
            mean = mean.replace(reg, '');
            break;
          }
          temp = temp.substr(0, temp.length - 1);
        }
      }
      temp = temp.replace('-','');
      var reg = new RegExp('^' + temp);
      if(mean.match(reg) !== null) { mean = mean.replace(reg, ''); }
      
      if(this.words[i].prss.filter(x => x.type === 's').length > 0) { 
        temp = this.words[i].prss.filter(x => x.type === 's')[0].key; 
        while(temp.length > 1) {
          temp = temp.replace('-','');
          if(mean.indexOf(temp) > -1) {
            mean = mean.replace(temp, '');
            break;
          }
          temp = temp.substr(0, temp.length - 1);
        }
      }
      
      return mean;
    },
    showSuffix: function(i) {
      if(this.words[i].prss.filter(x => x.type === 's').length > 0)
        return this.words[i].prss.filter(x => x.type === 's')[0].key;
      else 
        return '';
    },
    showPrefixMean: function(i) {
      if(this.words[i].prss.filter(x => x.type === 'p').length > 0)
        return this.words[i].prss.filter(x => x.type === 'p')[0].meaning;
      else if(this.words[i].prss.filter(x => x.type === 'r').length > 0)
        return this.words[i].prss.filter(x => x.type === 'r')[0].meaning;
      else 
        return '';
    },
    showSuffixMean: function(i) {
      if(this.words[i].prss.filter(x => x.type === 's').length > 0)
        return this.words[i].prss.filter(x => x.type === 's')[0].meaning;
      else 
        return '';
    }
  }
}
</script>
<style>
.bg-loading {
	display: none;
	position: absolute;
	z-index: 10;
	width: calc(100% - 70px);
	background-color: rgba(1,1,1,0.3);
	height: calc(100% - 212px);
	text-align: center;
}
.bg-loading > .spinner-border {
  margin-top: 15%;
}
.loading {
	display: block;
}
.layout {
  font-size: 20px;
}
.layout > a {
  width: 25px !important;
  margin-right: 20px;
}
.layout > a > img {
  width: 25px !important;
}
.bg-w {
  display: none;
}
.bg-active {
  display: block;
}
.prefix--text {
  color: #e57373 !important;
  fill: #e57373;
}
.word--text {
  color: #37474f;
}
.suffix--text {
  color: #7e57c2!important;
  fill: #9575cd;
}
.flex.type {
  width: 70px;
}
g.node-text {
  cursor: pointer;
}
g.node-text:hover {
  text-decoration: underline;
}
</style>