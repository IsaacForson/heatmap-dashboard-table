<template>
  <section class="new_dashboard_table_main-section">
    <div class="new_dashboard_table_table-header-container">
      <div class="new_dashboard_table_table-text-cover">
        <h2 style="margin: 0; padding: 0; margin-bottom: 5px;">Page Performance Overview</h2>
        <div class="new_dashboard_table_icon-tooltip-wrapper" @mouseleave="handleTooltipLeave"
          @mouseenter="toggleTooltip('iconTooltip', $event)">
          <svg @click="togglePerformanceTooltip($event)" 
            style="cursor: pointer; margin-left: 10px;" 
            width="24" 
            viewBox="0 0 24 24" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div v-if="activeTooltip && activeTooltip !== 'iconTooltip'" class="new_dashboard_table_tooltip"
            :style="tooltipStyle">
            {{ columns.find(col => col.id === activeTooltip)?.fullName }}
            <div class="new_dashboard_table_tooltip-arrow"></div>
          </div>
        </div>
        <div class="new_dashboard_table_icon-tooltip-wrapper">
        <div v-if="showPerformanceTooltip"
          class="performance_tooltip"
          :style="performanceTooltipStyle">
          <div>
            <span style="font-size: 14px; font-weight: 700;">Page Performance</span>
            <p style="font-size: 12px; padding-top: 0;">Learn how to use your analytics to find and view the pages of
              your website that have the most insights.</p>
            <button @click="handleViewTutorial"
              style="background-color: transparent; border: 1px solid #dddddd; font-size: 12px; padding: 8px 12px; border-radius: 6px; cursor: pointer;">View
              Tutorial</button>
          </div>
          <div class="new_dashboard_table_tooltip-arrow"></div>
        </div>
      </div>
      </div>
      <div class="new_dashboard_table_search-bar-container">
        <div class="new_dashboard_table_search-bar">
          <input id="new_dashboard_table_search-bar_input" type="text" v-model="searchQuery" placeholder="Search by page" @input="filterTable" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="new_dashboard_table_search-icon">
            <path
              d="M15.5 15.5L12.5834 12.5833M14.6667 7.58333C14.6667 11.4954 11.4954 14.6667 7.58333 14.6667C3.67132 14.6667 0.5 11.4954 0.5 7.58333C0.5 3.67132 3.67132 0.5 7.58333 0.5C11.4954 0.5 14.6667 3.67132 14.6667 7.58333Z"
              stroke="#717680" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    <div class="new_dashboard_table_table-container" :class="{ 'new_dashboard_table_dragging': isDragging }">
      <div v-if="isLoading" class="new_dashboard_table_loading-overlay">
        <div class="new_dashbaord_table_loader_cover">
          <img class="new_dashboard_table_loader_img" src="./assets/loader.gif" alt="Loading..." />
          <div class="new_dashboard_table_loading-text">Loading...</div>
        </div>
      </div>
      <div class="new_dashboard_table_scrollable-wrapper" @scroll="handleScroll">
        <div class="new_dashboard_table_table-header">
          <div v-for="(column, colIndex) in columns" :key="column.id" 
          class="new_dashboard_table_header-cell" 
          :class="{
            'new_dashboard_table_fixed-column': column.fixed,
            'new_dashboard_table_page-path': column.field === 'screenshot_url',
            'new_dashboard_table_heatmap': column.field === 'heatmap',
            'new_dashboard_table_column-dragging': isDragging && draggedColumnIndex === colIndex,
          }" :style="getColumnStyle(column)" draggable="true" @dragstart="dragStart(colIndex, $event)"
            @dragend="dragEnd" @dragover.prevent="dragOver($event, colIndex)" @dragleave="dragLeave"
            @drop="drop($event, colIndex)">
            <div class="new_dashboard_table_header-content">
              <span class="new_dashboard_table_header-text" @mouseover="showTooltip(column, $event)"
                @mouseleave="hideTooltip">
                <svg v-if="column.field === 'rps'" width="12"  viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px; pointer-events: none;">
                  <path d="M11.3333 10.3333H0.666626M0.666626 10.3333L3.33329 7.66667M0.666626 10.3333L3.33329 13M0.666626 3.66667H11.3333M11.3333 3.66667L8.66663 1M11.3333 3.66667L8.66663 6.33333" stroke="#2EC666" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ column.label }}
              </span>
              <span v-if="column.sortable" class="new_dashboard_table_sort-indicator" @click.stop="toggleSort(column)">
                <svg v-if="!column.sortDirection" width="17" height="16" viewBox="0 0 17 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 8H12.5M2.5 4H14.5M6.5 12H10.5" stroke="#ABABAB" stroke-width="0.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else-if="column.sortDirection === 'asc'" width="17" height="16" viewBox="0 0 17 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 8.05556H13.3333M9 3.72222H15.5M9 12.3889H11.1667M4.66667 13.1111V3M4.66667 13.1111L2.5 10.9444M4.66667 13.1111L6.83333 10.9444"
                    stroke="#2EC666" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style="transform: rotate(180deg)">
                  <path
                    d="M9 8.05556H13.3333M9 3.72222H15.5M9 12.3889H11.1667M4.66667 13.1111V3M4.66667 13.1111L2.5 10.9444M4.66667 13.1111L6.83333 10.9444"
                    stroke="#2EC666" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>

            <div v-if="column.field === 'screenshot_url'" class="new_dashboard_table_resizer-column"
              @mousedown.prevent="initResize($event)"></div>
          </div>
        </div>

        <div class="new_dashboard_table_table-body">
          <div v-for="(row, rowIndex) in paginatedData" :key="rowIndex" class="new_dashboard_table_table-row"
            :class="{ 'new_dashboard_table_striped': rowIndex % 2 === 1 }">
            <div v-for="(column, colIndex) in columns" :key="column.id" class="new_dashboard_table_table-cell" :class="{
              'new_dashboard_table_fixed-column': column.fixed,
              'new_dashboard_table_page-path': column.field === 'screenshot_url',
              'new_dashboard_table_heatmap': column.field === 'heatmap',
              'new_dashboard_table_column-dragging': isDragging && draggedColumnIndex === colIndex,
            }" :style="getColumnStyle(column)" :data-type="getColumnType(column.field)" draggable="true"
              @dragstart="dragStart(colIndex, $event)" @dragend="dragEnd" @dragover.prevent="dragOver($event, colIndex)"
              @dragleave="dragLeave" @drop="drop($event, colIndex)">
              <template v-if="column.field === 'heatmap'">
                <div class="new_dashboard_table_heatmap-icon">
                  <a :href="row.heatmap">
                    
<svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dii_362_57883)">
<rect x="2.5" y="1" width="32" height="32" rx="16" fill="#2EC666"/>
<rect x="3.5" y="2" width="30" height="30" rx="15" stroke="url(#paint0_linear_362_57883)" stroke-width="2"/>
<path d="M26.8334 16.9993H23.5M13.5 16.9993H10.1667M18.5 11.9993V8.66602M18.5 25.3327V21.9993M25.1667 16.9993C25.1667 20.6812 22.1819 23.666 18.5 23.666C14.8181 23.666 11.8334 20.6812 11.8334 16.9993C11.8334 13.3175 14.8181 10.3327 18.5 10.3327C22.1819 10.3327 25.1667 13.3175 25.1667 16.9993ZM21 16.9993C21 18.3801 19.8807 19.4993 18.5 19.4993C17.1193 19.4993 16 18.3801 16 16.9993C16 15.6186 17.1193 14.4993 18.5 14.4993C19.8807 14.4993 21 15.6186 21 16.9993Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_dii_362_57883" x="0.5" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_362_57883"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_362_57883" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_362_57883"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect3_innerShadow_362_57883"/>
<feOffset/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0"/>
<feBlend mode="normal" in2="effect2_innerShadow_362_57883" result="effect3_innerShadow_362_57883"/>
</filter>
<linearGradient id="paint0_linear_362_57883" x1="18.5" y1="1" x2="18.5" y2="33" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.12"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>

                  </a>
                </div>
              </template>
              <template v-else-if="column.field === 'screenshot_url'">
                <a :href="row[column.field]" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="new_dashboard_table_page-url" 
                  style="text-decoration: none; color: inherit;">
                  {{ row[column.field] }}
                </a>
                <div class="new_dashboard_table_resizer-column" @mousedown.prevent="initResize($event)">
                  <template v-if="rowIndex === 2">
                    <svg width="8" height="53" viewBox="0 0 8 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="8" height="53" fill="#eaeaea" />
                      <path d="M6 13L6 35" stroke="#363636" stroke-linecap="round" />
                      <path d="M3 13L3 35" stroke="#363636" stroke-linecap="round" />
                    </svg>
                  </template>
                </div>
              </template>
              <template v-else>
                <span
                  :class="{ 'new_dashboard_table_currency': isCurrency(column.field), 'new_dashboard_table_percentage': isPercentage(column.field) }">
                  {{ column.field === 'device_type' ? formatDeviceType(row[column.field]) :
                    formatValue(row[column.field], column.field) }}
                </span>
              </template>
            </div>
          </div>
          <div v-if="isEmptyState && !isLoading" class="new_dashboard_table_empty-state">
        <div class="new_dashboard_table_empty-state-content">
        <svg v-if="isSearchEmpty" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#CBD5E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 style="margin: 0px; padding: 0px; padding-bottom: 10px;">{{ isSearchEmpty ? 'No results found' : '' }}</h3>
        <p v-if="isSearchEmpty">
          We couldn't find any results for "{{ searchQuery }}".
          <br>Try adjusting your search to find what you're looking for.
        </p>
      </div>
    </div>
        </div>

        <div class="new_dashboard_table_scroll-indicator" v-show="showScrollIndicator">
          <div class="new_dashboard_table_scroll-indicator-content">
            <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 8V5M8.5 21C4.63401 21 1.5 17.866 1.5 14V8C1.5 4.13401 4.63401 1 8.5 1C12.366 1 15.5 4.13401 15.5 8V14C15.5 17.866 12.366 21 8.5 21Z" stroke="#81807B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="color: #2EC666;">More...</span>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="0.5" width="24" height="24" fill="url(#pattern0_3118_5452)"/>
            <defs>
            <pattern id="pattern0_3118_5452" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3118_5452" transform="scale(0.0025)"/>
            </pattern>
            <image id="image0_3118_5452" width="400" height="400" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAAXNSR0IArs4c6QAAFdBJREFUeF7t3dt220YSBVBKzk9bWZYoe8X+6VgYQxPNKLJlkkVcTgFbjzEbLO4q8qQBXm4O/ggQIECAQEHgprDGEgIECBAgcBAghoAAAQIESgICpMRmEQECBAgIEDNAgAABAiUBAVJis4gAAQIEBIgZIECAAIGSgAApsVlEgAABAgLEDBAgQIBASUCAlNgsIkCAAAEBYgYIECBAoCQgQEpsFhEgQICAADEDBAgQIFASECAlNosIECBAQICYAQIECBAoCQiQEptFBAgQICBAzAABAgQIlAQESInNIgIECBAQIGaAAAECBEoCAqTEZhEBAgQICBAzQIAAAQIlAQFSYrOIAAECBASIGSBAgACBkoAAKbFZRIAAAQICxAwQIECAQElAgJTYLCJAgAABAWIGCBAgQKAkIEBKbBYRIECAgAAxAwQIECBQEhAgJTaLCBAgQECAmAECBAgQKAkIkBKbRQQIECAgQMwAAQIECJQEBEiJzSICBAgQECBmgAABAgRKAgKkxGYRAQIECAgQM0CAAAECJQEBUmKziAABAgQEiBkgQIAAgZKAACmxWUSAAAECAsQMECBAgEBJQICU2CwiQIAAAQFiBggQIECgJCBASmwWESBAgIAAMQMECBAgUBIQICU2iwgQIEBAgJgBAgQIECgJCJASm0UECBAgIEDMAAECBAiUBARIic0iAgQIEBAgZoAAAQIESgICpMRmEQECBAgIEDNAgAABAiUBAVJis4gAAQIEBIgZIECAAIGSgAApsVlEgAABAgLEDBAgQIBASUCAlNgsIkCAAAEBYgYIECBAoCQgQEpsFhEgQICAADEDBAgQIFASECAlNosIECBAQICYAQIECBAoCQiQEptFBAgQICBAzAABAgQIlAQESInNIgIECBAQIGaAAAECBEoCAqTEZhEBAgQICBAzQIAAAQIlAQFSYrOIAAECBASIGSBAgACBkoAAKbFZRIAAAQICxAwQIECAQElAgJTYLCJAgAABAWIGCBAgQKAkIEBKbBYRIECAgAAxAwQIECBQEhAgJTaLCBAgQECAmAECBAgQKAkIkBKbRQQIECAgQMwAAQIECJQEBEiJzSICBAgQECBmgAABAgRKAgKkxGYRAQIECAgQM0CA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"/>
            </defs>
            </svg>

          </div>
        </div>
      </div>
    </div>

    <div class="new_dashboard_table_pagination-container">
      <button 
  class="new_dashboard_table_pagination-button new_dashboard_table_prev" 
  @click="previousPage"
  :disabled="currentPage === 1">
  ← Prev
</button>
  <div class="new_dashboard_table_pagination-numbers">
  <span 
    v-for="page in displayedPageNumbers" 
    :key="page"
    class="new_dashboard_table_pagination-number"
    :class="{
      'new_dashboard_table_active': currentPage === page,
      'new_dashboard_table_ellipsis': page === 'ellipsis'
    }"
    @click="page !== 'ellipsis' && changePage(page)">
    {{ page === 'ellipsis' ? '...' : page }}
  </span>
</div>
<button 
  class="new_dashboard_table_pagination-button new_dashboard_table_next" 
  @click="nextPage"
  :disabled="currentPage === totalPages">
  Next →
</button>
</div>
  </section>
  <VideoModal :show="showVideoModal" :video-source="videoSource" @close="showVideoModal = false" />
</template>

<script>
import VideoModal from './VideoModal.vue'

export default {
  components: {
    VideoModal
  },
  data() {
    return {
      showPerformanceTooltip: false,
    performanceTooltipStyle: {
      top: '0px',
      left: '0px',
    },
      videoSource: "https://player.vimeo.com/video/836887438?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
      baseUrl : window.location.origin + '/',
      currentPage: 1,
      itemsPerPage: 6,
      showVideoModal: false,
      tooltipClicked: false,
      activeTooltip: null,
      tooltipStyle: {
        top: '0px',
        left: '0px'
      },
      isDragging: false,
      draggedColumnIndex: null,
      dragOverColumnIndex: null,
      draggedColumn: null,
      mouseX: 0,
      mouseY: 0,
      pagePathWidth: 320,
      startX: null,
      startWidth: null,
      isResizing: false,
      searchQuery: '',
      originalTableData: [],
      showScrollIndicator: true,
      scrollTimeout: null,
      isLoading: false,
      columns: [
        { id: 1, label: 'Heatmap', field: 'heatmap', fixed: true, sortable: false, fullName: 'Heatmap', sortDirection: null },
        { id: 2, label: 'Page Path', field: 'screenshot_url', fixed: true, sortable: false, fullName: 'Page Path', sortDirection: null },
        { id: 5, label: 'Sessions', field: 'unique_visit', sortable: true, fullName: 'Total Sessions', sortDirection: null },
        { id: 8, label: 'RPS', field: 'rps', sortable: true, fullName: 'Total Revenue Per Session', sortDirection: null },
        { id: 7, label: 'Revenue', field: 'total_rev', sortable: true, fullName: 'Total Revenue', sortDirection: null },
        { id: 10, label: 'CVR', field: 'conv_rate', sortable: true, fullName: 'Conversion Rate', sortDirection: null },
        { id: 9, label: 'AOV', field: 'aov', sortable: true, fullName: 'Average Order Value', sortDirection: null },
        { id: 6, label: 'Purchases', field: 'purchases', sortable: true, fullName: 'Total Number of Purchases', sortDirection: null },
        { id: 3, label: 'Scroll Depth', field: 'scroll', sortable: true, fullName: 'Scroll Depth', sortDirection: null },
        { id: 4, label: 'Page Views', field: 'total_loghsr', sortable: true, fullName: 'Total Number of Page Views', sortDirection: null },
        { id: 11, label: 'Time on Page', field: 'time_on_page', sortable: true, fullName: 'Average Time on Page (seconds)', sortDirection: null },
      ],
      tableData: [],
    }
  },

  computed: {
    isEmptyState() {
    return !this.isLoading && this.tableData.length === 0;
  },
  
  isSearchEmpty() {
    return this.searchQuery && this.tableData.length === 0;
  },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tableData.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.tableData.length / this.itemsPerPage);
    },

    displayedPageNumbers() {
  if (this.totalPages <= 9) {
    // If total pages is 9 or less, show all numbers
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  if (this.currentPage <= 5) {
    // If we're in the first 5 pages, show 1-9, ..., lastPage
    return [
      ...Array.from({ length: 9 }, (_, i) => i + 1),
      'ellipsis',
      this.totalPages
    ];
  }

  if (this.currentPage > this.totalPages - 3) {
    // If we're in the last 5 pages, show firstPage, ..., last 9 pages
    return [
      1,
      'ellipsis',
      ...Array.from({ length: 9 }, (_, i) => this.totalPages - 8 + i)
    ];
  }

  // Otherwise show firstPage, ..., currentPage-4 to currentPage+4, ..., lastPage
  return [
    1,
    'ellipsis',
    ...Array.from({ length: 7 }, (_, i) => this.currentPage - 3 + i),
    'ellipsis',
    this.totalPages
  ];
},

    currentGroup() {
      return Math.floor((this.currentPage - 1) / 10);
    },

    isFirstGroup() {
      return this.currentGroup === 0;
    },

    isLastGroup() {
      return this.currentGroup >= Math.floor((this.totalPages - 1) / 10);
    },
  },

  created() {
    window.addEventListener('beforeunload', this.handlePageReload);
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.fetchSavedColumnArrangement().then(() => {
      this.fetchHeatmapData();
    });
    window.addEventListener('mousemove', this.handleResize)
    window.addEventListener('mouseup', this.stopResize)
    window.addEventListener('resize', this.handleWindowResize)
    const scrollableWrapper = document.querySelector('.new_dashboard_table_scrollable-wrapper');
    if (scrollableWrapper) {
      scrollableWrapper.addEventListener('scroll', this.handleScroll);
      this.checkScrollable(scrollableWrapper);
    }
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('beforeunload', this.handlePageReload);
    window.removeEventListener('mousemove', this.handleResize)
    window.removeEventListener('mouseup', this.stopResize)
    window.removeEventListener('resize', this.handleWindowResize)
    const scrollableWrapper = document.querySelector('.new_dashboard_table_scrollable-wrapper');
    if (scrollableWrapper) {
      scrollableWrapper.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    togglePerformanceTooltip(event) {
    this.showPerformanceTooltip = !this.showPerformanceTooltip;
    
    if (this.showPerformanceTooltip) {
      const rect = event.target.getBoundingClientRect();
      const wrapper = document.querySelector('.new_dashboard_table_table-text-cover');
      const wrapperRect = wrapper.getBoundingClientRect();
      
      this.performanceTooltipStyle = {
        top: `-191px`,
        left: `-147px`,
        width: '260px',
        height: '160px'
      };
    }
  },

  // Add click outside handler to mounted()
  handleClickOutside(event) {
    const tooltip = document.querySelector('.performance_tooltip');
    const icon = document.querySelector('.new_dashboard_table_icon-tooltip-wrapper svg');
    
    if (this.showPerformanceTooltip && 
        !tooltip?.contains(event.target) && 
        !icon?.contains(event.target)) {
      this.showPerformanceTooltip = false;
    }
  },
    handlePageReload() {
      this.fetchSavedColumnArrangement();
    },

    getIdSite() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('idSite') || '4';
    },

    getToken() {
      return localStorage.getItem('heatUserId') || 'baf71b8456d38060806a34e1f2e5a555';
    },

    async fetchSavedColumnArrangement() {
      try {
        const baseUrl = this.baseUrl
        const idSite = this.getIdSite();
        const token = this.getToken();
        const url = `${baseUrl}index.php?module=API&method=HeatmapSessionRecording.getDashboardPersistence&idSite=${idSite}&token=${token}`;
        const response = await fetch(url, {
          method: 'GET',
        });
        const result = await response.json();
        if (result.status === "success" && result.data && result.data.length > 0) {
          this.columns = result.data;
        }
      } catch (error) {
        // console.error('Error fetching saved column arrangement:', error);
      }
    },

    async saveColumnArrangement() {
      try {
        const baseUrl = this.baseUrl
        const idSite = this.getIdSite();
        const token = this.getToken();
        const url = `${baseUrl}index.php?module=API&method=HeatmapSessionRecording.getDashboardPersistence&idSite=${idSite}&token=${token}`;
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            data: this.columns
          })
        });
        const data = await response.json();
        if (data && data.columns) {
          this.data = data.columns;
        }

      } catch (error) {
        // console.error('Error saving column arrangement:', error);
      }
    },

    checkScrollable(element) {
      if (!element) return;
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
      const isScrolledToLeft = element.scrollLeft === 0;
      this.showScrollIndicator = hasHorizontalScroll && isScrolledToLeft;
    },

    handleWindowResize() {
      const scrollableWrapper = document.querySelector('.new_dashboard_table_scrollable-wrapper');
      this.checkScrollable(scrollableWrapper);
    },

    handleResize(event) {
      if (!this.isResizing) return;
      const diff = event.clientX - this.startX;
      const newWidth = Math.max(320, this.startWidth + diff);
      this.pagePathWidth = newWidth;
      
      this.$nextTick(() => {
        const scrollableWrapper = document.querySelector('.new_dashboard_table_scrollable-wrapper');
        this.checkScrollable(scrollableWrapper);
      });
    },

    previousPageGroup() {
  this.previousPage();
},

nextPageGroup() {
  this.nextPage();
},

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    handleScroll(event) {
      if (this.showScrollIndicator) {
        const indicator = event.target.querySelector('.new_dashboard_table_scroll-indicator');
        if (indicator) {
          indicator.classList.add('fade-out');
          setTimeout(() => {
            this.showScrollIndicator = false;
            indicator.classList.remove('fade-out');
          }, 300);
        }
      }

      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(() => {
        const element = event.target;
        if (element.scrollWidth > element.clientWidth && element.scrollLeft === 0) {
          this.showScrollIndicator = true;
        }
      }, 150);
    },

    formatDeviceType(type) {
      switch (type) {
        case 1: return 'Desktop'
        case 2: return 'Tablet'
        case 3: return 'Mobile'
        default: return 'Unknown'
      }
    },

    async fetchHeatmapData() {
      this.isLoading = true
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const idSite = urlParams.get('idSite') || 4
        const response = await fetch('https://hmd.heatmap.com/root', {
          method: 'POST',
          body: JSON.stringify({
            method: 'heatmapDataMetric',
            idSite,
            period: "month",
            request: "portal"
          })
        })

        const data = await response.json()

        this.tableData = data.heatmaps.map(item => ({
          heatmap: item.heatmap,
          screenshot_url: item.url,
          total_loghsr: item.pageviews,
          unique_visit: item.sessions,
          purchases: item.purchases,
          total_rev: item.revenue,
          rps: item.rps,
          aov: item.aov,
          conv_rate: item.conv_rate,
          scroll: item.scroll,
          time_on_page: item.time_on_page
        }))
        
        this.originalTableData = [...this.tableData]

        this.$nextTick(() => {
          const scrollableWrapper = document.querySelector('.new_dashboard_table_scrollable-wrapper');
          if (scrollableWrapper) {
            this.checkScrollable(scrollableWrapper);
          }
        });

      } catch (error) {
        // console.error('Error fetching heatmap data:', error)
      } finally {
        this.isLoading = false
      }
    },

    filterTable() {
      if (!this.searchQuery) {
        this.tableData = [...this.originalTableData]
        this.currentPage = 1
        return
      }

      const searchTerm = this.searchQuery.toLowerCase()
      const filteredData = this.originalTableData.filter(item => {
        return (
          item.screenshot_url?.toString().toLowerCase().includes(searchTerm) ||
          this.formatDeviceType(item.device_type).toLowerCase().includes(searchTerm) ||
          item.total_loghsr?.toString().toLowerCase().includes(searchTerm) ||
          item.unique_visit?.toString().toLowerCase().includes(searchTerm) ||
          item.purchases?.toString().toLowerCase().includes(searchTerm) ||
          item.total_rev?.toString().toLowerCase().includes(searchTerm) ||
          item.rps?.toString().toLowerCase().includes(searchTerm) ||
          item.aov?.toString().toLowerCase().includes(searchTerm) ||
          item.conv_rate?.toString().toLowerCase().includes(searchTerm)
        )
      })

      this.tableData = filteredData
      this.currentPage = 1
    },

    previousPage() {
  if (this.currentPage > 1) {
    this.changePage(this.currentPage - 1);
  }
},

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.changePage(this.currentPage + 1);
  }
},

changePage(page) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
},

toggleSort(column) {
  if (!column.sortable) return

  if (!column.sortDirection) {
    column.sortDirection = 'desc' // First click: highest first
  } else if (column.sortDirection === 'desc') {
    column.sortDirection = 'asc'  // Second click: lowest first
  } else {
    column.sortDirection = null   // Third click: reset
    // Reset the data to original order
    this.tableData = [...this.originalTableData]
    return
  }

  this.columns.forEach(col => {
    if (col.id !== column.id) {
      col.sortDirection = null
    }
  })

  this.sortTable(column)
},

    sortTable(column) {
      if (!column.sortDirection) return

      this.tableData.sort((a, b) => {
        const aValue = a[column.field]
        const bValue = b[column.field]

        if (column.sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    },

    showTooltip(param, event) {
      if (typeof param === 'object') {
        this.activeTooltip = param.id
      } else {
        this.activeTooltip = param
      }
      const rect = event.target.getBoundingClientRect()
      this.tooltipStyle = {
        top: `${rect.top - 80}px`,
        left: `${rect.left + rect.width / 2}px`,
        ...(param === 'iconTooltip' && { top: `${rect.top - 175}px` }),
      }
    },

    toggleTooltip(tooltipId, event) {
      if (this.activeTooltip === tooltipId) {
        this.tooltipClicked = !this.tooltipClicked
      } else {
        this.tooltipClicked = true
        this.showTooltip(tooltipId, event)
      }
    },

    handleTooltipLeave() {
      if (!this.tooltipClicked) {
        this.hideTooltip()
      }
    },

    hideTooltip() {
      this.activeTooltip = null
      this.tooltipClicked = false
    },

    handleViewTutorial() {
      this.hideTooltip()
      this.showPerformanceTooltip = false
      this.showVideoModal = true
    },

    getColumnStyle(column) {
      let style = {}

      if (column.field === 'screenshot_url') {
        style = {
          width: `${this.pagePathWidth}px`,
          minWidth: `${this.pagePathWidth}px`
        }
      } else if (column.field === 'heatmap') {
        style = {
          width: '60px',
          maxWidth: '60px'
        }
      }

      return style
    },

    dragStart(index, event) {
  if (this.columns[index].fixed) {
    event.preventDefault();
    return;
  }

  // Prevent dragging when interacting with sortable icons or header text
  if (
    event.target.classList.contains('new_dashboard_table_header-text') ||
    event.target.classList.contains('new_dashboard_table_sort-indicator')
  ) {
    event.preventDefault();
    return;
  }

  this.isDragging = true;
  this.draggedColumnIndex = index;
  this.draggedColumn = this.columns[index];

  // Add 'dragged-column' class to make the original column appear empty
  this.$nextTick(() => {
    const headerCells = document.querySelectorAll('.new_dashboard_table_header-cell');
    const bodyCells = document.querySelectorAll(`.new_dashboard_table_table-cell:nth-child(${index + 1})`);

    headerCells[index].classList.add('dragged-column');
    bodyCells.forEach(cell => {
      cell.classList.add('dragged-column');
    });
  });

  // Create ghost column
  const ghost = document.createElement('div');
  ghost.style.position = 'absolute';
  ghost.style.top = '0';
  ghost.style.pointerEvents = 'none';
  ghost.style.opacity = '0.9';
  ghost.style.zIndex = '1000';

  // Get elements for cloning
  const headerCell = document.querySelector(`.new_dashboard_table_header-cell:nth-child(${index + 1})`);
  const columnCells = Array.from(document.querySelectorAll(`.new_dashboard_table_table-cell:nth-child(${index + 1})`));
  const tableContainer = document.querySelector('.new_dashboard_table_table-container');
  const exactHeight = tableContainer.offsetHeight;

  // Set ghost dimensions
  ghost.style.width = `${headerCell.offsetWidth}px`;
  ghost.style.height = `${exactHeight}px`;

  // Clone header
  const clonedHeader = headerCell.cloneNode(true);
  clonedHeader.style.height = headerCell.offsetHeight + 'px';
  ghost.appendChild(clonedHeader);

  // Clone body cells with alternating backgrounds
  columnCells.forEach((cell, i) => {
    const clone = cell.cloneNode(true);
    clone.style.height = cell.offsetHeight + 'px';
    if (i % 2 === 0) {
      clone.style.backgroundColor = '#fbfbfb';
    } else {
      clone.style.backgroundColor = 'white';
    }
    ghost.appendChild(clone);
  });

  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost, 0, 0);

  // Remove ghost after setting as drag image
  requestAnimationFrame(() => document.body.removeChild(ghost));
},

dragOver(event, overIndex) {
  event.preventDefault();

  if (this.draggedColumnIndex === null || overIndex < 2) {
    return;
  }

  if (this.draggedColumnIndex !== overIndex) {
    const newColumns = [...this.columns];
    const [draggedColumn] = newColumns.splice(this.draggedColumnIndex, 1);
    newColumns.splice(overIndex, 0, draggedColumn);
    this.columns = newColumns;
    this.draggedColumnIndex = overIndex;
  }
},

    dragLeave() {
      this.dragOverColumnIndex = null
    },

    dragEnd() {
      this.isDragging = false
      this.draggedColumnIndex = null
      this.dragOverColumnIndex = null
      this.draggedColumn = null

      const draggingCells = document.querySelectorAll('.new_dashboard_table_dragging-column')
      draggingCells.forEach(cell => cell.classList.remove('new_dashboard_table_dragging-column'))
    },

    drop(event, dropIndex) {
  event.preventDefault();

  if (
    this.draggedColumnIndex === null ||
    this.draggedColumnIndex < 0 ||
    this.columns[dropIndex].fixed ||
    dropIndex < 2
  ) {
    console.log('Drop prevented', {
      draggedColumnIndex: this.draggedColumnIndex,
      isFixed: this.columns[dropIndex]?.fixed,
      dropIndex
    });
    return;
  }

  const newColumns = [...this.columns];
  const [draggedColumn] = newColumns.splice(this.draggedColumnIndex, 1);
  newColumns.splice(dropIndex, 0, draggedColumn);
  this.columns = newColumns;
  
  this.draggedColumnIndex = null;
  this.dragOverColumnIndex = null;
  this.isDragging = false;

  const headerCells = document.querySelectorAll('.new_dashboard_table_header-cell');
  const bodyCells = document.querySelectorAll('.new_dashboard_table_table-cell');

  headerCells.forEach(cell => {
    cell.classList.remove('dragged-column');
  });
  bodyCells.forEach(cell => {
    cell.classList.remove('dragged-column');
  });

  this.saveColumnArrangement();
},

    initResize(event) {
      this.isResizing = true
      this.startX = event.clientX
      this.startWidth = this.pagePathWidth
      event.stopPropagation()
    },

    stopResize() {
      this.isResizing = false
    },

    getColumnType(field) {
      const currencyFields = ['rps', 'total_rev', 'aov']
      const percentageFields = ['conv_rate']

      if (currencyFields.includes(field)) return 'currency'
      if (percentageFields.includes(field)) return 'percentage'
      return 'text'
    },

    formatValue(value, field) {
      if (value === null || value === undefined) return '0';

      if (field === 'time_on_page') {
        return `${value}s`;
      }

      if (['rps', 'total_rev', 'aov'].includes(field)) {
        const num = parseFloat(value);
        
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        }
        
        if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        
        return num.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      if (field === 'conv_rate' || field === 'scroll') {
        return `${Number(value).toFixed(2)}`;
      }

      if (['unique_visit', 'total_loghsr', 'purchases'].includes(field)) {
        const num = parseInt(value);
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
      }

      return value;
    },

    isCurrency(field) {
      return ['rps', 'total_rev', 'aov'].includes(field)
    },

    isPercentage(field) {
      return ['conv_rate'].includes(field)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.new_dashboard_table_header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 8px;
}

.new_dashboard_table_header-text,
.new_dashboard_table_sort-indicator {
  pointer-events: auto;
}

.new_dashboard_table_header-cell {
  cursor: grabbing;
  position: relative;
}


.new_dashboard_table_header-cell:active {
  cursor: grabbing;
}

.new_dashboard_table_header-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.new_dashboard_table_main-section {
  /* margin-top: 10%; */
  border: 1px solid #dddddd;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 10px;
}

.new_dashboard_table_table-text-cover {
  display: flex;
  align-items: center;
  padding-left: 28px;
}

.new_dashboard_table_table-text-cover>h2 {
  font-size: 16px;
  font-weight: bold;
}

.new_dashboard_table_header-text {
  position: relative;
  z-index: 2;
  cursor: pointer;
  display: flex;
}

.new_dashboard_table_table-container {
  width: 100%;
  position: relative;
  background: white;
  overflow: hidden;
  border-top: 1px solid #eaeaea;
  margin-bottom: 20px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.new_dashboard_table_loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(224, 223, 223, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@keyframes tooltipScaleIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.7);
  }

  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.new_dashbaord_table_loader_cover {
  background-color: white;
  padding: 14px 35px;
  border-radius: 8px;
}

.new_dashboard_table_loader_img {
  width: 50px;
  height: 50px;
}

.new_dashboard_table_loading-text {
  margin-top: 13px;
  font-size: 12px;
  color: #333;
}

.new_dashboard_table_spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2ec666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.new_dashboard_table_table-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  width: 100%;
}

.new_dashboard_table_search-bar-container {
  display: flex;
  align-items: center;
  padding-right: 28px;
}

.new_dashboard_table_search-bar {
  position: relative;
  width: 100%;
  max-width: 270px;
}

#new_dashboard_table_search-bar_input {
  width: 160px !important;
  padding:0px 1rem 0px 2.5rem !important;
  height: 41.5px;
  font-size: 14px !important;
  border: 1px solid #dddddd !important;
  border-radius: 10px !important;
  outline: none !important;
  font-weight: lighter !important;
  transition: border-color 0.3s !important;
}


#new_dashboard_table_search-bar_input:focus {
  border-color: #666 !important;
}

#new_dashboard_table_search-icon {
  position: absolute !important;
  top: 45% !important;
  left: 10px !important;
  transform: translateY(-50%) !important;
  width: 1rem !important;
  height: 1rem !important;
  color: #666 !important;
  pointer-events: none !important;

  /* top:45% */
}

.new_dashboard_table_scrollable-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.new_dashboard_table_table-header {
  display: flex;
  background: white;
  position: sticky;
  top: 0;
  z-index: 3;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
}

.new_dashboard_table_header-cell {
  padding: 16px 0px;
  height: 54px;
  font-weight: 500;
  flex: 1;
  min-width: 120px;
  cursor: grabbing;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 12px;
  background: white;
  transition: background 0.3s, transform 0.3s;
}

.new_dashboard_table_header-cell:active {
  cursor: grabbing;
}

.new_dashboard_table_table-body {
  white-space: nowrap;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: fit-content;
}

.new_dashboard_table_table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #fbfbfb;
  width: 100%;
  min-width: fit-content;
}

.new_dashboard_table_table-row.new_dashboard_table_striped {
  background-color: white;
}

.new_dashboard_table_table-cell {
  padding: 16px 10px 16px 5px;
  height: 54px; 
  flex: 1;
  min-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grabbing;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.new_dashboard_table_table-cell.new_dashboard_table_page-path {
  justify-content: center;
}

#new_dashboard_table_page-url {
  color: #666;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.4;
  max-height: 2.8em;
  padding: 0px 20px 0px 10px !important;
  text-align: start;
  width: 100%;
}

.new_dashboard_table_column-dragging {
  border-left: 2px solid #eaeaea;
  border-right: 2px solid #eaeaea;
  cursor: grabbing;
  box-shadow: 5px 5px 15px solid brack
  ;
}

.new_dashboard_table_header-cell.new_dashboard_table_column-dragging {
  border-left: 2px solid #eaeaea;
  border-right: 2px solid #eaeaea;
  cursor: grabbing;
}

.new_dashboard_table_dragging {
  opacity: 1;
  transform: none;
  box-shadow: none;
}

.new_dashboard_table_fixed-column {
  position: sticky;
  z-index: 4;
  cursor: default !important;
  display: flex;
  justify-content: center;
  background-color: inherit;
}

.new_dashboard_table_table-row .new_dashboard_table_fixed-column {
  background-color: inherit;
}

.new_dashboard_table_header-cell.new_dashboard_table_page-path,
.new_dashboard_table_table-cell.new_dashboard_table_page-path {
  border-left: 1px solid #eaeaea;
}

.new_dashboard_table_fixed-column:nth-child(1) {
  left: 0;
  z-index: 5;
  width: 100px;
  min-width: 100px;
}

.new_dashboard_table_fixed-column:nth-child(2) {
  left: 100px;
  z-index: 5;
  width: 200px;
  min-width: 200px;
}

.new_dashboard_table_sort-indicator {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}
.new_dashboard_table_reorder-indicator {
  margin-right: 8px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.new_dashboard_table_sort-indicator svg {
  transition: transform 0.3s ease;
}

.new_dashboard_table_sort-indicator:hover {
  opacity: 0.8;
}

.new_dashboard_table_resizer-column {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 9px;
  background: transparent;
  cursor: col-resize;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new_dashboard_table_resizer-column::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 9px;
  background-color: #eaeaea;
  transform: translateX(-50%);
  transition: background-color 0.2s ease;
  z-index: 6;
}

.new_dashboard_table_resizer-column svg {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 7;
  pointer-events: none;
  padding: 0px 2px 0px 0px;
}

.new_dashboard_table_table-cell.new_dashboard_table_column-drag-animation {
  transition: transform 0.2s ease;
}

.new_dashboard_table_dragging-column {
  background: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.new_dashboard_table_heatmap-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-top: 7px;
}

.new_dashboard_table_heatmap-icon img {

  display: block;
  object-fit: contain;
}

/* Make sure the table cell containing the heatmap has proper height */
.new_dashboard_table_table-cell.new_dashboard_table_heatmap {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0px;
}

.new_dashboard_table_tooltip {
  position: fixed;
  transform: translateX(-50%) scale(1);
  background: white;
  padding: 18px 12px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  white-space: wrap;
  color: #333;
  border: 1px solid #eee;
  width: 150px;
  height: 70px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  line-height: 20px;
  animation: tooltipScaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top center;
  opacity: 1;
}

.new_dashboard_table_tooltip-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.new_dashboard_table_currency::before {
  content: '$ ';
  color: #666;
}

.new_dashboard_table_percentage::after {
  content: ' %';
  color: #666;
}

.new_dashboard_table_table-row:hover {
  background-color: #f5f5f5 !important;
  transition: .1s ease-in;
}

.new_dashboard_table_table-row.new_dashboard_table_striped:hover {
  background-color: #f5f5f5 !important;
  transition: .1s ease-in;
}

.new_dashboard_table_pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-top: 2rem; */
  gap: 0.5rem;
}

.new_dashboard_table_pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.new_dashboard_table_pagination-button:hover {
  background-color: #f0f0f0;
}

.new_dashboard_table_pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.new_dashboard_table_pagination-number {
  padding: 0.5rem;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.new_dashboard_table_pagination-number.new_dashboard_table_active {
  background-color: #2ec666;
  color: white;
}

.new_dashboard_table_pagination-number:hover {
  background-color: #f0f0f0;
}

.new_dashboard_table_pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.new_dashboard_table_pagination-button:not(:disabled):hover {
  background-color: #f0f0f0;
}

.new_dashboard_table_pagination-number:hover:not(.new_dashboard_table_active) {
  background-color: #f0f0f0;
}

.new_dashboard_table_pagination-number.new_dashboard_table_ellipsis {
  cursor: default;
  background-color: transparent;
}

.new_dashboard_table_pagination-number.new_dashboard_table_ellipsis:hover {
  background-color: transparent;
}

.new_dashboard_table_scroll-indicator {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 120px;
  pointer-events: none;
  z-index: 5;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.new_dashboard_table_scroll-indicator.fade-out {
  opacity: 0;
}

.new_dashboard_table_scroll-indicator-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
  color: #666666;
  font-size: 14px;
}

.new_dashboard_table_scroll-indicator svg {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(0);
  }

  40% {
    transform: translateX(5px);
  }

  60% {
    transform: translateX(3px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* empty data style */
.new_dashboard_table_empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  background: white;
}

.new_dashboard_table_empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 400px;
  animation: fadeIn 0.3s ease-in;
}

.new_dashboard_table_empty-state-content svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.new_dashboard_table_empty-state-content h3 {
  margin: 0;
  color: #4A5568;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.new_dashboard_table_empty-state-content p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
  line-height: 1.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* tootip issue */
.new_dashboard_table_icon-tooltip-wrapper {
  position: relative;
}

.performance_tooltip {
  position: absolute;
  background: white;
  padding: 18px 12px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  white-space: wrap;
  color: #333;
  border: 1px solid #eee;
  text-align: center;
  transform-origin: top center;
}

</style>