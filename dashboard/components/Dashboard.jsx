import React from "react";
import { Box } from "@adminjs/design-system";
import { Bar, Doughnut } from "react-chartjs-2";
import { ApiClient } from "adminjs";

const Dashboard = (props) => {
  console.log(props);
  const vendorData = [10, 20, 30, 40];
  const reviewsData = [5, 15, 25, 35];
  const reportsData = [8, 18, 28, 38];
  const productsData = [12, 22, 32, 42];

  const chartOptions = {
    // Customize chart options if needed
  };

  const api = ApiClient();

  useEffects(() => {
    console.log(api.getDashboard());
  }, []);

  return (
    <Box>
      <Box variant="grey">
        <h2>Vendor Statistics</h2>
        <Bar
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{ data: vendorData }],
          }}
          options={chartOptions}
        />
      </Box>

      <Box variant="grey">
        <h2>Reviews Statistics</h2>
        <Doughnut
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{ data: reviewsData }],
          }}
          options={chartOptions}
        />
      </Box>

      <Box variant="grey">
        <h2>Reports Statistics</h2>
        <Bar
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{ data: reportsData }],
          }}
          options={chartOptions}
        />
      </Box>

      <Box variant="grey">
        <h2>Products Statistics</h2>
        <Doughnut
          data={{
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{ data: productsData }],
          }}
          options={chartOptions}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
