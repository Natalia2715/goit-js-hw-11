const axios = require('axios');

export default class GetPhotos {
    constructor() {
    this.searchQuery = '';
    this.page = 1;
    }

    async getImg() {
    const API_KEY = "27295449-3daac49b31b72326d27830ec0";

    const params = new URLSearchParams({
        page: this.page,
        per_page: 40,
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch:true,    
    });
  const response = await axios.get(`https://pixabay.com/api/?${params}&q=${encodeURIComponent(this.searchQuery)}`);
      const img = await response.data;
      
        return img
    }
    
      incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    }
    
      get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
