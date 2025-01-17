import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { DirectorComponent } from '../director/director.component';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {

    this.fetchApiData.getAllMovies().subscribe(res => {
      // this.movies = res;
      const movies = res;
      let user = JSON.parse(localStorage.getItem("user") || "");
      movies.forEach((movie: any) => {
        movie.isFavorite = user?.FavoriteMovies?.includes(movie._id);
      })
      this.movies = movies;
      console.log(this.movies)
      return this.movies;
    }, err => {
      console.error(err)
    })
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }

  redirectProfile(): void {
    this.router.navigate(["profile"]);
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    let icon = document.getElementById(`${movie._id}-favorite-icon`);
    console.log(user, movie)
    if (user.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData.deleteFavouriteMovies(user.Username, movie._id).subscribe(res => {
        icon?.setAttribute("fontIcon", "favorite_border");

        console.log("del success")
        console.log(res);
        user.favoriteMovies = res.favoriteMovies;
        localStorage.setItem("user", JSON.stringify(user));
        this.snackBar.open('Movie removed from favorites!', 'OK', { duration: 2000 });
      }, err => {
        console.error(err)
      })
    } else {
      // icon?.setAttribute("fontIcon", "favorite");
      // user.favoriteMovies.push(movie._id);
      // addFavoriteMovie return unauth, debugging
      this.fetchApiData.addFavouriteMovies(user.Username, movie._id).subscribe(res => {
        icon?.setAttribute("fontIcon", "favorite");

        console.log("add success")
        console.log(res);
        user.favoriteMovies = res.FavoriteMovies;
        localStorage.setItem("user", JSON.stringify(user));
        this.snackBar.open('Movie added to favorites!', 'OK', { duration: 2000 });
      }, err => {
        console.error(err)
      })
    }
    localStorage.setItem("user", JSON.stringify(user));
  }

  showGenre(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: String(movie.genre.type).toUpperCase(),
        content: movie.genre.description
      },
      width: "400px"
    })
  }
  showDirector(movie: any): void {
    this.dialog.open(DirectorComponent, {
      data: {
        name: movie.Director.Name,
        bio: movie.Director.Bio,
        birth: movie.Director.Birth,
        death: movie.Director.Death
      },
      width: "400px"
    })
  }
  showDetail(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: movie.Title,
        content: movie.Description
      },
      width: "400px"
    })
  }
}