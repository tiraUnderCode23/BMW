import React, { useState, useEffect } from 'react';
import bmwModels from '../../data/bmw_models.json';
import bmwYearsGenerations from '../../data/bmw_years_generations.json';

// --- Interfaces ---
interface SelectionPayload {
  model: string;
  modelName: string;
  year: string;
  yearText: string;
  generation: string;
  generationText: string;
}

// ✨ تعديل: أضفنا `t` إلى الواجهة لاستقبال كائن الترجمة
interface ModelSelectorProps {
  onSelectionChange: (selection: SelectionPayload | null) => void;
  t: any; // كائن الترجمة
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelectionChange, t }) => {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedModelName, setSelectedModelName] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedYearText, setSelectedYearText] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [selectedGenerationText, setSelectedGenerationText] = useState<string>('');

  const [availableYears, setAvailableYears] = useState<Array<{ value: string, text: string }>>([]);
  const [availableGenerations, setAvailableGenerations] = useState<Array<{ value: string, text: string }>>([]);

  useEffect(() => {
    setSelectedYear('');
    setSelectedGeneration('');
    setAvailableGenerations([]);
    if (selectedModel) {
      const modelData = bmwYearsGenerations[selectedModel as keyof typeof bmwYearsGenerations];
      setAvailableYears(modelData ? modelData.years : []);
    } else {
      setAvailableYears([]);
    }
  }, [selectedModel]);

  useEffect(() => {
    setSelectedGeneration('');
    if (selectedModel && selectedYear) {
      const modelData = bmwYearsGenerations[selectedModel as keyof typeof bmwYearsGenerations];
      const yearData = modelData?.years.find(y => y.value === selectedYear);
      setAvailableGenerations(yearData ? yearData.generations : []);
    } else {
      setAvailableGenerations([]);
    }
  }, [selectedYear, selectedModel]);

  useEffect(() => {
    if (selectedModel && selectedYear && selectedGeneration) {
      onSelectionChange({
        model: selectedModel,
        modelName: selectedModelName,
        year: selectedYear,
        yearText: selectedYearText,
        generation: selectedGeneration,
        generationText: selectedGenerationText,
      });
    } else {
      onSelectionChange(null);
    }
  }, [selectedModel, selectedYear, selectedGeneration, selectedModelName, selectedYearText, selectedGenerationText, onSelectionChange]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
    setSelectedModel(value);
    setSelectedModelName(text);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
    setSelectedYear(value);
    setSelectedYearText(text);
  };

  const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
    setSelectedGeneration(value);
    setSelectedGenerationText(text);
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      {/* ✨ تعديل: استخدام النصوص من كائن الترجمة t */}
      <h2 className="text-2xl font-bold mb-6 text-center text-white">{t.selectorTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model Dropdown */}
        <div className="space-y-2">
          <label htmlFor="model-select" className="block text-white font-medium">{t.selectorSeries}</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.selectorSelectSeries}</option>
            {bmwModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.text}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="space-y-2">
          <label htmlFor="year-select" className="block text-white font-medium">{t.selectorYear}</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            disabled={!selectedModel}
            className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">{t.selectorSelectYear}</option>
            {availableYears.map((year) => (
              <option key={year.value} value={year.value}>
                {year.text}
              </option>
            ))}
          </select>
        </div>

        {/* Generation Dropdown */}
        <div className="space-y-2">
          <label htmlFor="generation-select" className="block text-white font-medium">{t.selectorGeneration}</label>
          <select
            id="generation-select"
            value={selectedGeneration}
            onChange={handleGenerationChange}
            disabled={!selectedYear}
            className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">{t.selectorSelectGeneration}</option>
            {availableGenerations.map((generation) => (
              <option key={generation.value} value={generation.value}>
                {generation.text}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;