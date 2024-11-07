export async function newFilms(page) {
   try {
      const response = await fetch(`https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching films:", error);
      return null;
   }
}

export async function getFilmCategory(slug, page) {
   try {
      const response = await fetch(`https://phim.nguonc.com/api/films/danh-sach/${slug}?page=${page}`);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching films:", error);
      return null;
   }
}

export async function getFilm(slug) {
   try {
      const response = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching films:", error);
      return null;
   }
}

export async function searchFilm(slug) {
   try {
      const response = await fetch(`https://phim.nguonc.com/api/films/search?keyword=${slug}`);
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching films:", error);
      return null;
   }
}