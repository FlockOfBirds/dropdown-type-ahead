const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const packageName = process.env.npm_package_name;
const mxHost = process.env.npm_package_config_mendixHost || "http://localhost:8080";
const developmentPort = process.env.npm_package_config_developmentPort || "3000";

const widgetConfig = {
    context: __dirname,
    entry: {
        DropdownReference: "./src/DropdownReference/components/DropdownReferenceContainer.ts",
        DropdownReferenceSet: "./src/DropdownReferenceSet/components/DropdownReferenceSetContainer.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "widgets/com/mendix/widget/custom/dropdown/[name].js",
        libraryTarget: "umd",
        publicPath: "/"
    },
    devServer: {
        port: developmentPort,
        proxy: [ {
            context: [ "**",
                `!/widgets/com/mendix/widget/custom/dropdown/DropdownReference.js`,
                `!/widgets/com/mendix/widget/custom/dropdown/DropdownReferenceSet.js`
            ],
            target: mxHost,
            onError: function(err, req, res) {
                if (res && res.writeHead) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    if (err.code === "ECONNREFUSED") {
                        res.end("Please make sure that the Mendix server is running at " + mxHost
                            + " or change the configuration \n "
                            + "> npm config set " + packageName + ":mendixhost http://host:port");
                    } else {
                        res.end("Error connecting to Mendix server"
                        + "\n " + JSON.stringify(err, null, 2));
                    }
                }
            }
        } ],
        stats: "errors-only"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                }
            },
            { test: /\.(css|scss)$/, use: [
                "style-loader", "css-loader", "sass-loader"
            ] },
        ]
    },
    mode: "development",
    devtool: "eval",
    externals: [ "mendix/lang", "react", "react-dom" ],
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin(
            [ {
                from: "src/**/*.xml",
                toType: "template",
                to: "widgets/[name].[ext]"
            } ],
            { copyUnmodified: true }
        ),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    context: __dirname,
    entry: {
        DropdownReference: "./src/DropdownReference/DropdownReference.webmodeler.ts",
        DropdownReferenceSet: "./src/DropdownReferenceSet/DropdownReferenceSet.webmodeler.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "widgets/[name].webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.scss$/, use: [ "raw-loader", "sass-loader" ]},
            { test: /\.css$/, loader: "raw-loader" }
        ]
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [ new webpack.LoaderOptionsPlugin({ debug: true }) ]
};

module.exports = [ widgetConfig, previewConfig ];
