document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('http://localhost:5000/api/data');
    const data = await response.json();

    const problemTypeSelect = document.getElementById('problemTypeSelect');
    const radarChart = document.getElementById('radarChart').getContext('2d');

    const labels = data.map(d => d.problem_type);
    const roundedRadarPlugin = {
        id: 'roundedRadar',
        afterDatasetsDraw: function (chart) {
          const ctx = chart.ctx;
      
          chart.data.datasets.forEach((dataset, index) => {
            const meta = chart.getDatasetMeta(index);
      
            meta.data.forEach((point, index) => {
              const { x, y } = point.getCenterPoint();
      
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = dataset.pointBackgroundColor[index];
              ctx.fill();
            });
          });
        },
      };
    // Fill the dropdown list with problem types
    labels.forEach(label => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        problemTypeSelect.appendChild(option);
    });
    const averageValues = {
        impact_score: 0,
        exploitability_score: 0,
        exploit_code_maturity: 0,
        impact_subscore_modifiers: 0,
        integrity_impact: 0
    };

    data.forEach(d => {
        averageValues.impact_score += d.impact_score;
        averageValues.exploitability_score += d["exploitability_score"];
        averageValues.exploit_code_maturity += d["exploit_code_maturity"];
        averageValues.impact_subscore_modifiers += d["impact_subscore_modifiers"];
        averageValues.integrity_impact += d["integrity_impact"];
    });

    for (const key in averageValues) {
        averageValues[key] /= data.length;
    }
    // Create a radar chart for the selected problem type
    let chart;
    function updateRadarChart() {
        const selectedProblemType = problemTypeSelect.value;
        const selectedData = data.find(d => d.problem_type === selectedProblemType);
        const problemTypeHeading = document.getElementById('problemTypeHeading');
        problemTypeHeading.textContent = selectedProblemType;

        const description = document.getElementById('description');
        description.textContent = selectedData.description;

        const impactScore = document.getElementById('impactScore');
        impactScore.textContent = parseFloat(selectedData.impact_score).toFixed(2);

        const exploitabilityScore = document.getElementById('exploitabilityScore');
        exploitabilityScore.textContent = parseFloat(selectedData.exploitability_score).toFixed(2);

        const exploitCodeMaturity = document.getElementById('exploitCodeMaturity');
        exploitCodeMaturity.textContent = parseFloat(selectedData.exploit_code_maturity).toFixed(2);

        const impactSubscoreModifiers = document.getElementById('impactSubscoreModifiers');
        impactSubscoreModifiers.textContent = parseFloat(selectedData.impact_subscore_modifiers).toFixed(2);

        const integrityImpact = document.getElementById('integrityImpact');
        integrityImpact.textContent = parseFloat(selectedData.integrity_impact).toFixed(2);

        const impactScoreDifference = document.getElementById('impactScoreDifference');
        impactScoreDifference.textContent = (selectedData.impact_score - averageValues.impact_score).toFixed(2);
        impactScoreDifference.style.color = parseFloat(impactScoreDifference.textContent) >= 0 ? 'green' : 'red'; 

        const exploitabilityScoreDifference = document.getElementById('exploitabilityScoreDifference');
        exploitabilityScoreDifference.textContent = (selectedData.exploitability_score - averageValues.exploitability_score).toFixed(2);
        exploitabilityScoreDifference.style.color = parseFloat(exploitabilityScoreDifference.textContent) >= 0 ? 'green' : 'red'; 
        
        const exploitCodeMaturityDifference = document.getElementById('exploitCodeMaturityDifference');
        exploitCodeMaturityDifference.textContent = (selectedData.exploit_code_maturity - averageValues.exploit_code_maturity).toFixed(2);
        exploitCodeMaturityDifference.style.color = parseFloat(exploitCodeMaturityDifference.textContent) >= 0 ? 'green' : 'red'; 

        const integrityImpactDifference = document.getElementById('integrityImpactDifference');
        integrityImpactDifference.textContent = (selectedData.impact_score - averageValues.integrity_impact).toFixed(2);
        integrityImpactDifference.style.color = parseFloat(integrityImpactDifference.textContent) >= 0 ? 'green' : 'red'; 
        
        const impactSubscoreModifiersDifference = document.getElementById('impactSubscoreModifiersDifference');
        impactSubscoreModifiersDifference.textContent = (selectedData.impact_subscore_modifiers - averageValues.impact_subscore_modifiers).toFixed(2);
        impactSubscoreModifiersDifference.style.color = parseFloat(impactSubscoreModifiersDifference.textContent) >= 0 ? 'green' : 'red'; 

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(radarChart, {
            type: 'radar',
            data: {
                labels: ['Impact Score', 'Exploitability Score', 'Exploit Code Maturity', 'Impact Subscore Modifiers', 'Integrity Impact'],
                datasets: [{
                    label: selectedProblemType,
                    data: [
                        selectedData.impact_score,
                        selectedData["exploitability_score"],
                        selectedData["exploit_code_maturity"],
                        selectedData["impact_subscore_modifiers"],
                        selectedData["integrity_impact"]
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    
                },
                {
                    label: 'Average',
                    data: [
                        averageValues.impact_score,
                        averageValues.exploitability_score,
                        averageValues.exploit_code_maturity,
                        averageValues.impact_subscore_modifiers,
                        averageValues.integrity_impact
                    ],
                    backgroundColor: 'rgba(211, 211, 211, 0.2)',
                    borderColor: 'rgba(211, 211, 211, 1)',
                    pointBackgroundColor: 'rgba(211, 211, 211, 1)',
                    borderWidth:1,

                }]
            },
            options: {
                plugins: [roundedRadarPlugin],
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 1
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    // Update the radar chart when the selected problem type changes
    problemTypeSelect.addEventListener('change', updateRadarChart);
    updateRadarChart();
    // Update the problem info
// function to generate table rows
    const tableBody = document.getElementById('dataTable');
    const tbody = document.createElement('tbody');
    tableBody.appendChild(tbody);
    // Create a table row for each data item
    data.forEach((d, index) => {
    const tr = document.createElement('tr');

    // Create a table cell for the problem type
    const problemTypeTd = document.createElement('td');
    problemTypeTd.textContent = d.problem_type;
    tr.appendChild(problemTypeTd);

    // Create a table cell for the impact score
    const impactScoreTd = document.createElement('td');
    impactScoreTd.textContent = d.impact_score;
    tr.appendChild(impactScoreTd);

    // Create a table cell for the exploitability score
    const exploitabilityScoreTd = document.createElement('td');
    exploitabilityScoreTd.textContent = d.exploitability_score;
    tr.appendChild(exploitabilityScoreTd);

    // Create a table cell for the exploit code maturity
    const exploitCodeMaturityTd = document.createElement('td');
    exploitCodeMaturityTd.textContent = d.exploit_code_maturity;
    tr.appendChild(exploitCodeMaturityTd);

    // Create a table cell for the impact subscore modifiers
    const impactSubscoreModifiersTd = document.createElement('td');
    impactSubscoreModifiersTd.textContent = d.impact_subscore_modifiers;
    tr.appendChild(impactSubscoreModifiersTd);

    // Create a table cell for the integrity impact
    const integrityImpactTd = document.createElement('td');
    integrityImpactTd.textContent = d.integrity_impact;
    tr.appendChild(integrityImpactTd);

    // Create a table cell for the average
    const averageTd = document.createElement('td');
    averageTd.textContent = d.average;
    tr.appendChild(averageTd);

    // Create a table cell for the rank
    const rankTd = document.createElement('td');
    rankTd.textContent = d.rank;
    tr.appendChild(rankTd);

    // Add the row to the table body
    tbody.appendChild(tr);
});

});
