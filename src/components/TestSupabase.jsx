// src/components/TestSupabase.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TestSupabase = () => {
  const [status, setStatus] = useState("Testing...");
  const [data, setData] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check if we can connect
      const { data: testData, error } = await supabase
        .from("searches")
        .select("count(*)")
        .limit(1);

      if (error) throw error;

      setStatus("✅ Connected to Supabase!");

      // Test 2: Fetch some data
      const { data: sampleData } = await supabase
        .from("searches")
        .select("*")
        .limit(3);

      setData(sampleData || []);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px 0" }}>
      <h3>Supabase Connection Test</h3>
      <p>
        <strong>Status:</strong> {status}
      </p>

      {data.length > 0 && (
        <div>
          <p>
            <strong>Sample Data:</strong>
          </p>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {item.search_term} - {item.count} searches
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={testConnection}>Test Again</button>
    </div>
  );
};

export default TestSupabase;
