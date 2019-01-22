import React, { Component } from "react";
import { Page } from "./Page";

export class Error404 extends Component {
    public render() {
        return (
            <Page title="">
                <div id="page-404">
                    <img src="/404.png" />
                </div>
            </Page>
        )
    }
}