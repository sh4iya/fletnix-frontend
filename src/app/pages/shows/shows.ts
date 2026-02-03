import { Component, OnInit } from '@angular/core';
import { ShowsService } from '../../services/shows';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getToken, removeToken } from '../../services/storage.util';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shows.html',
  styleUrl: './shows.css',
})
export class Shows implements OnInit {

  searchText = '';
  selectedType = 'All';
  hasInteracted = false;
  
  shows: any[] = [];
  filteredShows: any[] = [];

  private searchSubject = new Subject<string>();



  selectedShow: any = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;


  constructor(private showsService: ShowsService,private router: Router) {}

 ngOnInit() {
  this.searchSubject
    .pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(() => {
      this.loadShows();
    });

  this.searchSubject.next(''); // initial load
}



loadShows() {
  this.showsService
    .getShows(
      this.currentPage,
      this.itemsPerPage,
      this.searchText,
      this.selectedType
    )
    .subscribe({
      next: (res: any) => {
        this.shows = res.data || [];

        //  always update filtered list
        this.filteredShows = [...this.shows];

        this.totalPages = res.totalPages || 1;

        // mark interacted so empty state hides
        this.hasInteracted = true;
      },
      error: () => {
        this.filteredShows = [];
        this.totalPages = 1;
      }
    });
}


applyFilters() {
  this.currentPage = 1;
  this.searchSubject.next(this.searchText + '|' + this.selectedType);
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

formatCast(cast: any): string {
  if (Array.isArray(cast)) {
    return cast.join(', ');
  }
  return cast || '';
}

  isLocked(show: any): boolean {
    const age = this.getUserAge();
    return age !== null && age < 18 && show.rating === 'R';
  }
}
