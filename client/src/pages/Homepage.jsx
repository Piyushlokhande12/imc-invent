import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import imclogo from "../assets/imclogo.png";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Google Charts script
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      // Initialize and draw the charts
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(drawCharts);
    };
    document.body.appendChild(script);

    // Define the drawCharts function to draw both charts
    function drawCharts() {
      drawLineChart();
      drawBarChart();
    }

    function drawLineChart() {
      var data = window.google.visualization.arrayToDataTable([
        ["Days", "Sales", "Expenses"],
        ["Week1", 10000, 25000],
        ["Week2", 43000, 20000],
        ["Week3", 30000, 40000],
        ["Week4", 70000, 35000],
        ["Week5", 58000, 45000],
        ["Week6", 78000, 22000],
        ["Week7", 60000, 44000],
      ]);

      var options = {
        curveType: "function",
        legend: "none",
        hAxis: {
          title: "Weeks",
        },
        vAxis: {
          title: "Transactions",
          minValue: 0,
          ticks: [
            { v: 0, f: "0" },
            { v: 20000, f: "20k" },
            { v: 40000, f: "40k" },
            { v: 60000, f: "60k" },
            { v: 80000, f: "80k" },
            { v: 100000, f: "100k" },
          ],
        },
      };

      var chart = new window.google.visualization.LineChart(
        document.getElementById("curve_chart")
      );

      chart.draw(data, options);
    }

    function drawBarChart() {
      var data = window.google.visualization.arrayToDataTable([
        ["Department", "Total"],
        ["IT", 19000 + 25000],
        ["Revenue", 38000 + 42000],
        ["Finance", 8000 + 14000],
        ["Aictsl", 40000 + 55000],
        ["Smart City", 38000 + 60000],
        ["Water Supply", 25000 + 52000],
        ["Health", 47000 + 29000],
      ]);

      var options = {
        legend: "none",
        bar: { groupWidth: "50%" },
        hAxis: {
          title: "Transactions",
        },
        vAxis: {
          title: "Department",
          minValue: 0,
          ticks: [
            { v: 0, f: "$0" },
            { v: 20000, f: "$20k" },
            { v: 40000, f: "$40k" },
            { v: 60000, f: "$60k" },
            { v: 80000, f: "$80k" },
            { v: 100000, f: "$100k" },
          ],
        },
        colors: ["#1e90ff"],
      };

      var chart = new window.google.visualization.BarChart(
        document.getElementById("barchart_values")
      );
      chart.draw(data, options);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <img
              src={imclogo}
              className="mx-auto mb-8 w-40 h-40 rounded-full"
              alt="IMC Logo"
            />
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Welcome to Indore Municipal Corporation
            </h1>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              इंदौर नगर निगम आपका स्वागत करता है
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Serving the people with dedication and integrity.
            </p>
          </div>
        </section>
        <div className="flex justify-around mt-10">
          <section className="w-[50%] p-4 bg-white shadow-md rounded-lg">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mt-3">
                Weekly Transactions and Expenses
              </h2>
              <div
                id="curve_chart"
                className="mx-auto"
                style={{ height: "250px" }}
              ></div>
            </div>
          </section>

          <section className="w-[50%] p-4 bg-white shadow-md rounded-lg">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mt-4">
                Department Wise Monthly Transactions
              </h2>
              <div
                id="barchart_values"
                className="mx-auto"
                style={{ height: "250px" }}
              ></div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
