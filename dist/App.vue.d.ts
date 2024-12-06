export default _sfc_main;
declare namespace _sfc_main {
    const components: undefined;
    function data(): {
        showPerformanceTooltip: boolean;
        performanceTooltipStyle: {
            top: string;
            left: string;
        };
        videoSource: string;
        baseUrl: string;
        currentPage: number;
        itemsPerPage: number;
        showVideoModal: boolean;
        tooltipClicked: boolean;
        activeTooltip: null;
        tooltipStyle: {
            top: string;
            left: string;
        };
        isDragging: boolean;
        draggedColumnIndex: null;
        dragOverColumnIndex: null;
        draggedColumn: null;
        mouseX: number;
        mouseY: number;
        pagePathWidth: number;
        startX: null;
        startWidth: null;
        isResizing: boolean;
        searchQuery: string;
        originalTableData: never[];
        showScrollIndicator: boolean;
        scrollTimeout: null;
        isLoading: boolean;
        columns: ({
            id: number;
            label: string;
            field: string;
            fixed: boolean;
            sortable: boolean;
            fullName: string;
            sortDirection: null;
        } | {
            id: number;
            label: string;
            field: string;
            sortable: boolean;
            fullName: string;
            sortDirection: null;
            fixed?: undefined;
        })[];
        tableData: never[];
    };
    namespace computed {
        function isEmptyState(): any;
        function isSearchEmpty(): any;
        function paginatedData(): any;
        function totalPages(): any;
        function displayedPageNumbers(): any;
        function currentGroup(): any;
        function isFirstGroup(): any;
        function isLastGroup(): any;
    }
    function created(): void;
    function mounted(): void;
    function beforeUnmount(): void;
    namespace methods {
        function togglePerformanceTooltip(event: any): void;
        function handleClickOutside(event: any): void;
        function handlePageReload(): void;
        function getIdSite(): string;
        function getToken(): string;
        function fetchSavedColumnArrangement(): Promise<void>;
        function saveColumnArrangement(): Promise<void>;
        function checkScrollable(element: any): void;
        function handleWindowResize(): void;
        function handleResize(event: any): void;
        function previousPageGroup(): void;
        function nextPageGroup(): void;
        function changePage(page: any): void;
        function changePage(page: any): void;
        function handleScroll(event: any): void;
        function formatDeviceType(type: any): "Desktop" | "Tablet" | "Mobile" | "Unknown";
        function fetchHeatmapData(): Promise<void>;
        function filterTable(): void;
        function previousPage(): void;
        function nextPage(): void;
        function toggleSort(column: any): void;
        function sortTable(column: any): void;
        function showTooltip(param: any, event: any): void;
        function toggleTooltip(tooltipId: any, event: any): void;
        function handleTooltipLeave(): void;
        function hideTooltip(): void;
        function handleViewTutorial(): void;
        function getColumnStyle(column: any): {};
        function dragStart(index: any, event: any): void;
        function dragOver(event: any, overIndex: any): void;
        function dragLeave(): void;
        function dragEnd(): void;
        function drop(event: any, dropIndex: any): void;
        function initResize(event: any): void;
        function stopResize(): void;
        function getColumnType(field: any): "text" | "currency" | "percentage";
        function formatValue(value: any, field: any): any;
        function isCurrency(field: any): boolean;
        function isPercentage(field: any): boolean;
    }
}
