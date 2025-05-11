import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="cookieCard">
        <p className="cookieHeading">Ближайший заказ</p>
        <p className="cookieDescription">Здесь должен отображаться последний заказ и это должно быть как-то взаимосвязано с бэком, пощадите пожалуйста </p>
        <button className="acceptButton">Это кнопка</button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cookieCard {
    border-radius: 10px;

    margin-left: 400px;
    margin-top: -400px;

    width: 500px;
    height: 300px;

    background: grey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  

  .cookieHeading {
    font-size: 1.5em;
    font-weight: 600;
    color: rgb(241, 241, 241);
    z-index: 2;
  }

  .cookieDescription {
    font-size: 1em;
    color: rgb(241, 241, 241);
    z-index: 2;
  }

  .cookieDescription a {
    color: rgb(241, 241, 241);
  }

  .acceptButton {
    padding: 11px 20px;
    background-color: #7b57ff;
    transition-duration: .2s;
    border: none;
    color: rgb(241, 241, 241);
    cursor: pointer;
    font-weight: 600;
    z-index: 2;
  }

  .acceptButton:hover {
    background-color: pink;
    transition-duration: .2s;
  }`;

export default Card;
