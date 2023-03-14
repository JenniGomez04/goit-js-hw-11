import axios from "axios";

let keyApi = '22814732-c072aba9b3863a4ff839d34a8';

export async function searchImages(searchQuery, page) {
  let url = `https://pixabay.com/api/?key=${keyApi}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  let response = await axios.get(url);
console.log(response.data);
  return response.data;
}

searchImages('dog', 1);









