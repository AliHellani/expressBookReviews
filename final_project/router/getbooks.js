const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getBooks();

async function getBookDetails(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getBookDetails('123');

  async function getBooksByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getBooksByAuthor('Chinua Achebe');

  async function getBooksByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getBooksByTitle('Fairy tales');