<template>
    <!-- Transition wrapper for fade animation effects -->
    <Transition name="new_dashboard_table_modal-fade">
      <!-- Modal overlay - only shown when 'show' prop is true -->
      <div v-if="show" class="new_dashboard_table_modal-overlay">
        <!-- Main modal container -->
        <div class="new_dashboard_table_modal-content">
          <!-- Modal header section with title and close button -->
          <div class="new_dashboard_table_modal-header">
            <h4 style="margin-top: 0px;">Page Performance</h4>
            <!-- Close button emits 'close' event to parent -->
            <button @click="$emit('close')" class="new_dashboard_table_close-button">×</button>
          </div>
  
          <!-- Video section with responsive player -->
         <!--  <div class="new_dashboard_table_video-container">
            <video 
              controls
              ref="videoPlayer"
              class="new_dashboard_table_video-player">
              <source :src="videoSource" type="video/mp4">
            </video>
          </div> -->
          <div class="new_dashboard_table_video-container">
            <iframe
              :src="videoSource"
              class="new_dashboard_table_video-player"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
  
          <!-- Informational text content section -->
          <div class="new_dashboard_table_modal-text">
            <h3>How to use Analytics</h3>
            <p style="font-weight: 100 !important;">
              Ecommerce measurement helps you understand what your customers like, 
              how well your marketing works, and how to make your online store better 
              to increase sales and engagement. For example, by implementing ecommerce events, 
              you can figure out which colors are most popular, how large the average order 
              value is, and whether certain promotions increase purchases.
            </p>
          </div>
  
          <!-- Modal footer with done button -->
          <div class="new_dashboard_table_modal-footer">
            <!-- Done button with check icon -->
            <button @click="$emit('close')" class="new_dashboard_table_done-button"> 
              <span style="margin-right: 3px;">Done</span>  
              <img class="new_dashboard_table_check" src="./assets/check.png" alt="">
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  // Import required Vue composition API functions
//   import { defineProps } from 'vue'
  
  // Define component props with types and default values
  defineProps({
    show: {
      type: Boolean,
      default: false  // Modal is hidden by default
    },
    videoSource: {
      type: String,
      required: true  // Video source URL is required
    }
  })
  </script>
  
  <style scoped>
  /* Modal overlay styles - creates semi-transparent backdrop */
  .new_dashboard_table_modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Main modal container styles */
  .new_dashboard_table_modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  /* Header section styles with flex layout */
  .new_dashboard_table_modal-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 20px;
    border-bottom: 1px solid #eaeaea;
  }
  
  /* Close button styles */
  .new_dashboard_table_close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  /* Video container styles for responsive layout */
  /* .new_dashboard_table_video-container {
    width: 100%;
    margin-bottom: 20px;
  } */
  .new_dashboard_table_video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    margin-bottom: 20px;
  }
  
  /* Video player styles with 16:9 aspect ratio */
  /* .new_dashboard_table_video-player {
    width: 100%;
    aspect-ratio: 16/9;
  } */
  .new_dashboard_table_video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  
  /* Text content styles */
  .new_dashboard_table_modal-text {
    margin-bottom: 20px;
    font-size: 13px;
    line-height: 20px;
  }
  
  /* Footer section styles */
  .new_dashboard_table_modal-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #eaeaea;
    padding-top: 15px;
  }
  
  /* Done button styles with hover effect */
  .new_dashboard_table_done-button {
    background: #2EC666;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .new_dashboard_table_done-button:hover{
    background: #27B45D;
  }
  
  /* Transition animation styles */
  .new_dashboard_table_modal-fade-enter-active,
  .new_dashboard_table_modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .new_dashboard_table_modal-fade-enter-from,
  .new_dashboard_table_modal-fade-leave-to {
    opacity: 0;
  }
  
  /* Check icon size */
  .new_dashboard_table_check{
    width: 20px;
  }
  </style>