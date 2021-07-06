<template>
  <div id="app">
    <h1>Book Finder</h1>

    <div>
      <input ref="searchBox" type="text" placeholder="Search..." />
      <button class="searchButton" @click="searchBooks">Search</button>
    </div>

    <div class="booksContainer">
      <div class="books" v-for="book in books" :key="book.id">
        <img :src="book.image" width="50" height="75" />
        <div class="title">{{ book.title.length < 55 ? book.title : book.title.substring(0,55) + "..."  }}</div>
        <div class="description">{{ book.author }}</div>
      </div>
    </div>

    <div class="errorMessage" v-if="failedSearch">
      I didn't find any matches. Please try again
    </div>
    
    <button v-if="page > 1" @click="previousHandler">
      Previous
    </button>

    <button v-if="successfulSearch" @click="nextHandler">
      Next
    </button>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      page: 1,
      showNext: false,
      failedSearch: false,
      successfulSearch: false,
      query: "",
      baseURL: "https://GoodreadsProject.marcmarti1.repl.co/search?page=",
      request: ""
    };
  },
  methods: {
    searchBooks() {
      // track that the user has searched for something
      this.hasSearched = true;

      // reset the page tracker to 1 after each search
      this.page = 1;

      // update the request url to contain the page and query
      this.query = this.$refs.searchBox.value;
      this.requestHelper();
      this.successfulSearch = !this.failedSearch;
    },
    nextHandler() {
      this.page++;
      this.requestHelper();
    },
    previousHandler() {
      this.page--;
      this.requestHelper();
    },
    async requestHelper() {
      this.request = this.baseURL + this.page + "&q=" + this.query;
      let response = await fetch(this.request);
      this.books = await response.json();

      // Keep track if the search was a success
      this.failedSearch = this.books.length > 0 ? false : true;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 5%;
  margin-left: 5%;
}

input,
button {
  font-size: 20px;
}

button:hover {
  cursor: pointer;
}

.booksContainer {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-bottom: 30px;
}
  
.books {
  background-color: #cdcdcd;
  margin: 10px;
  padding: 15px;
  border-radius: 5px;
  max-width: 180px;
}

.title {
  padding: 4px;
}  
  
.errorMessage {
  margin: 20px;
  color: #4fc08d;
  font-size: 18px;
}
</style>
