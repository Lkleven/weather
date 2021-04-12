import styled from "styled-components"

const Input = (props) => {
    return (
        <Form>
            <label>
                {/* TODO screenreader only label */}
                <input
                    type="text"
                    value={props.text}
                    onChange={(e) => props.setValue(e.target.value)}
                    placeholder={'By eller tettsted'}
                ></input>
            </label>
            <button text="Legg til" onClick={(e) => props.submit(e)}>Legg til</button>
        </Form>
    );
};

export default Input;

const Form = styled.form`
    display: flex;
    height: 40px;
    width: 100%;
    max-width: 500px;
    margin: 20px 0;
    padding: 0 10px;
    box-sizing: border-box;

    > * {
        height: 100%;
    }

    label {
        flex: 6;
    }

    input {
        font-size: 1.2rem;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 4px;
        box-sizing: border-box;
        border-right: none;
        border-width: 1px;
    }

    button {
        flex: 2;
        font-weight: bold;
        color: white;
        background: #2594fb;
        border: none;
        border-radius: 0;
        font-size: 1.1rem;
    }
`
