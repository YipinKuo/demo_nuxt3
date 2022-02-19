<template>
<div class="container-xxl">
  <div class="bd-content ps-lg-4">
  <header class="py-3 mb-3 border-bottom">
    <div class="container-fluid d-grid gap-3 align-items-center" style="grid-template-columns: 1fr 2fr;">
      <div class="dropdown">
        <a @click="ddm_onclick()" class="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none dropdown-toggle" id="dropdownNavLink" data-bs-toggle="dropdown" aria-expanded="false"> 單字瀏覽 </a>
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
  
  <div class="container-fluid pb-3">
    <div class="d-grid gap-3" style="grid-template-columns: 1fr 2fr;">
      <div class="bg-loading text-primary" v-bind:class="[loading]">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="bg-light border rounded-3">
        <ul class="list-group">
          <li v-for="(w, i) in words" class="list-group-item" v-bind:class="{ active: word_index === i }" @click="word_onclick(i)">{{ w.word }}</li>
        </ul>
      </div>
      <div class="bg-light border rounded-3">
        <pre> {{ show_word() }} </pre>
      </div>
    </div>
  </div>
  
  </div>
</div>
</template>

<script>
import axios from 'axios';

var ddm_sub_show = false;
var ddm_index = 0;
var loading = true;
var query = 'a';
var words = [];
var word_index = 0;
export default {
  data(){ 
	ddm_sub_show = false;
	ddm_index = 0;
    query = 'a';
	loading = true;
    words = [];
	word_index = 0;
    return {
      ddm_sub_show,
      ddm_index,
	  query,
	  loading,
	  words,
	  word_index
    }
  },
  async setup() {
    const { data: resp } = await useFetch(
      `/api/data_wordbrowser`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/json' },
        body: JSON.stringify({
          page: 1,
          query: query
        })
      }
    );
    words = JSON.parse(resp.value);
	loading = false;
    return { };
  },
  watch: {
    query: function(newVal, oldVal) { 
		this.loading = true;
		this.word_index = 0;
		this.words = [];
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
    },
    show_word: function() {
      return (this.words) ? JSON.stringify(this.words[this.word_index], undefined, 2) : '';
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
</style>