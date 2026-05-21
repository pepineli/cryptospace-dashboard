import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('priceChart') priceChartCanvas!: ElementRef;
  @ViewChild('mainChart') mainChartCanvas!: ElementRef;
  
  cryptos: any[] = [];
  filteredCryptos: any[] = [];
  loading = true;
  searchTerm = '';
  selectedCrypto: any = null;
  historyData: any = null;
  chart: any = null;
  chartLoading = false;
  mainChart: any = null;
  bitcoinData: any = null;
  bitcoinHistoryData: any = null;
  
  sortType: string = 'rank';
  sortAscending: boolean = true;
  perPage: number = 20;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCryptos();
  }

  ngAfterViewInit(): void {}

  loadCryptos(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.apiService.getCryptos('brl', this.perPage).subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.cryptos = data;
          this.filteredCryptos = [...data];
          this.applySortAndFilter();
        } else {
          console.error('Dados invalidos:', data);
        }
        this.loading = false;
        this.cdr.detectChanges();
        this.loadBitcoinData();
      },
      error: (err: any) => {
        console.error('Erro:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadBitcoinData(): void {
    this.apiService.getCryptoHistory('bitcoin', 7).subscribe({
      next: (data: any) => {
        this.bitcoinHistoryData = data;
        this.bitcoinData = this.cryptos && this.cryptos.find(c => c.id === 'bitcoin');
        this.cdr.detectChanges();
        setTimeout(() => this.createMainChart(), 200);
      },
      error: (err: any) => {
        console.error('Erro ao carregar Bitcoin:', err);
      }
    });
  }

  changePerPage(amount: number): void {
    this.perPage = amount;
    this.loadCryptos();
  }

  createMainChart(): void {
    if (this.mainChart) {
      this.mainChart.destroy();
      this.mainChart = null;
    }

    if (!this.mainChartCanvas || !this.bitcoinHistoryData || !this.bitcoinHistoryData.prices) {
      return;
    }

    const prices = this.bitcoinHistoryData.prices;
    const labels = prices.map((item: [number, number]) => {
      const date = new Date(item[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const chartData = prices.map((item: [number, number]) => item[1]);

    const ctx = this.mainChartCanvas.nativeElement.getContext('2d');
    this.mainChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Preco BTC (BRL)',
            data: chartData,
            borderColor: '#7c5cff',
            backgroundColor: 'rgba(124, 92, 255, 0.1)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#7c5cff',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#a0a0c0', font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => `Preco: ${this.formatPrice(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#606090' }, grid: { color: 'rgba(96, 96, 144, 0.2)' } },
          y: { ticks: { color: '#606090' }, grid: { color: 'rgba(96, 96, 144, 0.2)' } }
        }
      }
    });
  }

  applySortAndFilter(): void {
    if (!this.cryptos || !Array.isArray(this.cryptos)) {
      return;
    }
    
    let result = [...this.cryptos];
    
    if (this.searchTerm && this.searchTerm.trim()) {
      result = result.filter(crypto =>
        crypto.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (result.length > 0) {
      result.sort((a, b) => {
        let aValue: number, bValue: number;
        switch (this.sortType) {
          case 'price':
            aValue = a.current_price;
            bValue = b.current_price;
            break;
          case 'change':
            aValue = a.price_change_percentage_24h;
            bValue = b.price_change_percentage_24h;
            break;
          case 'marketCap':
            aValue = a.market_cap;
            bValue = b.market_cap;
            break;
          default:
            aValue = a.market_cap_rank;
            bValue = b.market_cap_rank;
            break;
        }
        return this.sortAscending ? aValue - bValue : bValue - aValue;
      });
    }
    
    this.filteredCryptos = result;
    this.cdr.detectChanges();
  }

  sortBy(type: string): void {
    if (this.sortType === type) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortType = type;
      this.sortAscending = true;
    }
    this.applySortAndFilter();
  }

  toggleOrder(): void {
    this.sortAscending = !this.sortAscending;
    this.applySortAndFilter();
  }

  filterCryptos(): void {
    this.applySortAndFilter();
  }

  selectCrypto(crypto: any): void {
    this.selectedCrypto = crypto;
    this.loadHistory(crypto.id);
  }

  loadHistory(id: string): void {
    this.chartLoading = true;
    this.cdr.detectChanges();
    
    this.apiService.getCryptoHistory(id, 7).subscribe({
      next: (data: any) => {
        this.historyData = data;
        this.chartLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.createChart(), 100);
      },
      error: (err: any) => {
        console.error('Erro ao carregar histórico:', err);
        this.chartLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (!this.priceChartCanvas || !this.historyData || !this.historyData.prices) {
      return;
    }

    const prices = this.historyData.prices;
    const labels = prices.map((item: [number, number]) => {
      const date = new Date(item[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const data = prices.map((item: [number, number]) => item[1]);

    const ctx = this.priceChartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Preco (BRL) - ${this.selectedCrypto?.name || ''}`,
          data: data,
          borderColor: '#7c5cff',
          backgroundColor: 'rgba(124, 92, 255, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#7c5cff',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a0a0c0', font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (context) => `Preco: ${this.formatPrice(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#606090' }, grid: { color: 'rgba(96, 96, 144, 0.2)' } },
          y: { ticks: { color: '#606090' }, grid: { color: 'rgba(96, 96, 144, 0.2)' } }
        }
      }
    });
  }

  closeModal(): void {
    this.selectedCrypto = null;
    this.historyData = null;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  formatPrice(price: any): string {
    if (price === null || price === undefined || isNaN(price)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  formatPercentage(value: any): string {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    const signal = value > 0 ? '+' : '';
    return `${signal}${Math.abs(value).toFixed(2)}%`;
  }

  getPercentageClass(value: any): string {
    if (value === null || value === undefined || isNaN(value)) return 'positive';
    return value >= 0 ? 'positive' : 'negative';
  }
}