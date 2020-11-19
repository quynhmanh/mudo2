import styled from 'styled-components';

export default styled.div`
    margin-right: 7px;
    display: ${props => props.show ? "block" : "none"}
`;