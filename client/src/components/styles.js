import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  color: #3B0270;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 6px 30px rgba(11,10,20,0.08);
  opacity: 0;
  transform: translateY(-12px);
  transition: all 0.35s ease;
  z-index: 10;

  ${({ show }) =>
    show &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;

export const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-off-white);
  padding: 1.5rem;
  width: 100%;
  overflow-x: hidden; /* prevent horizontal scroll */

  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(11,10,20,0.08);
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 1024px) {
    flex-direction: row;
    max-width: 950px;
  }

  @media (max-width: 768px) {
    box-shadow: 0 8px 24px rgba(11,10,20,0.08);
  }

  @media (max-width: 576px) {
    background: #fff;
    box-shadow: none;
    border-radius: 0.75rem;
  }
`;

export const ImageSliderPanel = styled.div`
  position: relative;
  flex-basis: 50%;
  min-height: 14rem;
  overflow: hidden;
  background: linear-gradient(135deg, #6F00FF 0%, #3B0270 100%);

  @media (min-width: 1024px) {
    flex-basis: 60%;
    min-height: auto;
  }

  @media (max-width: 992px) {
    display: none; /* hide slider on tablets & below */
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const SliderImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(p) => (p.active ? 1 : 0)};
  transition: opacity 1s ease;
`;

export const FormPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1.5rem;
  width: 100%;
  box-sizing: border-box; /* ensures padding doesn’t cause overflow */

  @media (min-width: 1024px) {
    flex-basis: 40%;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.25rem;
  }

  @media (max-width: 576px) {
    padding: 1.5rem 1rem;
    background: #fff;
    border-radius: 1rem;
  }

  h2 {
    text-align: center;
    color: #3B0270;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;

    @media (max-width: 576px) {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  }

  form {
    width: 100%;
    max-width: 100%; /* prevent form overflow */
  }
`;

export const Logo = styled(Link)`
  display: block;
  margin: 0 auto 1.5rem auto;
  width: 100px;

  @media (max-width: 576px) {
    width: 80px;
    margin-bottom: 1rem;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  width: 100%;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #475569;
    margin-bottom: 0.35rem;

    @media (max-width: 576px) {
      font-size: 0.85rem;
    }
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 0.6rem;
    border: 1px solid #E2E8F0;
    font-size: 0.95rem;
    transition: all 0.15s ease;
    box-sizing: border-box;

    @media (max-width: 576px) {
      padding: 0.75rem 0.9rem;
      font-size: 0.9rem;
    }

    &:focus {
      border-color: #6F00FF;
      outline: none;
      box-shadow: 0 0 0 3px rgba(111, 0, 255, 0.1);
    }
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.6rem;
  border: none;
  background: var(--color-bright-violet);
  color: var(--color-off-white);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;

  @media (max-width: 576px) {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }

  &:hover {
    background: var(--color-dark-purple);
    color: var(--color-off-white);
    transform: translateY(-2px);
    border: 1px solid var(--color-dark-purple);
    box-shadow: 0 8px 24px rgba(111, 0, 255, 0.2);
  }
`;

export const SignInLink = styled(Link)`
  display: block;
  text-align: center;
  color: #64748b;
  margin-top: 1rem;
  font-size: 0.9rem;

  @media (max-width: 576px) {
    font-size: 0.85rem;
  }

  span {
    color: #6F00FF;
    font-weight: 600;
    margin-left: 0.25rem;
  }
`;
