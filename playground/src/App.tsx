import { Button } from "@stamcat/chadman/Button";
import { Checkbox } from "@stamcat/chadman/Checkbox";
import "./App.scss";

export function App() {
    return (
        <div className="app">
            <h1 className="app__title">Chadman Playground</h1>
            <div className="app__row">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <label className="app__checkbox-label" htmlFor="subscribe">
                    <Checkbox id="subscribe" defaultChecked />
                    Subscribe
                </label>
            </div>
        </div>
    );
}
