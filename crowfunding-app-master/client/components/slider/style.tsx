"use client";

import styled from "styled-components";

const StyleWrapper = styled.section`
  position: relative;
  .section_title {
    h2 {
      display: flex;
    }
  }
  .slick-slider {
    display: flex !important;
    place-content: center !important;
  }
  .slick-dots {
    position: fixed !important;
    top: 0;
    width: 100vw;
    display: flex !important;
    justify-content: space-evenly;
    align-items: center;
    height: 60px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(4px);
    background: #15322b;

    li {
      min-height: 60px;
      width: calc(100% / 6);
      display: block;
      transition: background-color 0.6s ease;
      font-family: "__DM_Mono_5b09c7";
      font-style: normal;
      font-weight: 400;
      font-size: 0.7rem;
      line-height: 16px;
      text-transform: uppercase;
      color: #ffffff;
      border-right: 1px solid rgba(255, 255, 255, 0.15);
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      margin: 0;
      transition: all 0.3s;

      span {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }
      &:hover,
      &.slick-active {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(4px);
      }
    }
  }

  .collapse_icon {
    position: fixed;
    right: 20px;
    bottom: 22px;
    color: #ffffff;
    span {
      height: 25px;
      width: 25px;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      display: none;
    }

    .collapse_icon_open {
      transform: rotate(-180deg);
    }
  }

  @media only screen and (max-width: 767px) {
    .slick-dots {
      .collapse_icon_close {
        transform: rotate(180deg);
      }

      flex-direction: row !important;
      height: 60px;
      width: 75vw;
      left: 0;
      li {
        width: 100%;
      }
    }

    .collapse_icon {
      span {
        display: block;
      }
    }

    .slick__slider {
      &.slider_collapse {
        .slick-dots {
          li {
            display: none;

            &.slick-active {
              display: block;
            }
          }
        }
      }
    }
  }
`;
export default StyleWrapper;
