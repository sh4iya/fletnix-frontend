import { Component, OnInit } from '@angular/core';
import { ShowsService } from '../../services/shows';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getToken, removeToken } from '../../services/storage.util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shows.html',
  styleUrl: './shows.css',
})
export class Shows implements OnInit {

  searchText = '';
  selectedType = 'Movie';
  hasInteracted = false;

  shows: any[] = [];
  filteredShows: any[] = [];

  selectedShow: any = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;

  constructor(private showsService: ShowsService,private router: Router) {}

  ngOnInit() {
    this.loadShows();
  }

  loadShows() {
  this.showsService
    .getShows(this.currentPage, this.itemsPerPage)
    .subscribe({
      next: (res: any) => {
        console.log("API RES:", res);

        if (Array.isArray(res?.data)) {
          this.shows = res.data;
        } else {
          console.error("Invalid shows data", res);
          this.shows = [];
        }

        this.filteredShows = [...this.shows];
        this.totalPages = res?.totalPages || 1;
      },

      error: (err) => {
        console.error('Error fetching shows', err);
        this.shows = [];
        this.filteredShows = [];
        this.totalPages = 1;
      }
    });
}


  applyFilters() {
  if (!Array.isArray(this.shows)) {
    console.warn("Shows not ready yet");
    this.filteredShows = [];
    return;
  }

  const search = this.searchText.trim().toLowerCase();

  this.filteredShows = this.shows.filter(show => {
    const matchesTitle =
      !search || show.title?.toLowerCase().includes(search);

    const matchesCast =
      !search || show.cast?.toLowerCase().includes(search);

    const matchesType =
      !this.selectedType || show.type === this.selectedType;

    return (matchesTitle || matchesCast) && matchesType;
  });

  this.currentPage = 1;
  this.hasInteracted = true;
}


 nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadShows();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadShows();
    }
  }



  logout() {
    removeToken();
  this.router.navigate(['/login']);
  }

  openDetails(show: any) {
    if (this.isLocked(show)) {
      alert('🔞 This content is restricted to users below 18');
      return;
    }
    this.selectedShow = show;
  }

  closeDetails() {
    this.selectedShow = null;
  }

  getUserAge(): number | null {
    const token = getToken();
    if (!token) return null;

    try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.age ?? null;
  } catch {
    return null;
  }
}

  isLocked(show: any): boolean {
    const age = this.getUserAge();
    return age !== null && age < 18 && show.rating === 'R';
  }
}
