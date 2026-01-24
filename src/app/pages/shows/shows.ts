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
  providers: [ShowsService]
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

  constructor(private showsService: ShowsService,private router: Router) {}

  ngOnInit() {
    this.showsService.getShows().subscribe({
      next: (data) => {
        console.log('SHOWS RECEIVED:', data);

        this.shows = data;
        this.filteredShows = [...this.shows];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching shows', err);
      }
    });
  }

  applyFilters() {
  const search = this.searchText.trim().toLowerCase();

  this.filteredShows = this.shows.filter(show => {
    const matchesTitle =
      search === '' || show.title?.toLowerCase().includes(search);

    const matchesCast =
      search === '' || show.cast?.toLowerCase().includes(search);

    const matchesType =
      this.selectedType === '' || show.type === this.selectedType;

    return (matchesTitle || matchesCast) && matchesType;
  });

  this.currentPage = 1;
  this.hasInteracted = true;
}

 get paginatedShows() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredShows.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredShows.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
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
