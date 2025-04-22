
import { RulesByCategory } from "@/components/admin/rules/types";
import { apiService } from "@/services/api";
import { ruleCategories } from "@/components/admin/rules/rulesData";

// Create an initial structure based on rule categories
const createInitialRuleStructure = () => {
  return Object.fromEntries(
    ruleCategories.map(category => [category.id, []])
  );
};

// Get all rules 
export const getRules = async (): Promise<RulesByCategory> => {
  try {
    // In a real implementation, this would call the API
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This would be replaced with an actual API call like:
    // return await apiService.get<RulesByCategory>('/api/rules');
    
    // Mock data from local storage or initial state
    const storedRules = localStorage.getItem('rules');
    if (storedRules) {
      return JSON.parse(storedRules) as RulesByCategory;
    }
    
    // Create an empty structure if nothing in localStorage
    return createInitialRuleStructure();
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
};

// Update a rule
export const updateRule = async (rule: any): Promise<any> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would call:
    // return await apiService.put(`/api/rules/${rule.id}`, rule);
    
    // For now, we'll update the rule in localStorage
    const storedRules = localStorage.getItem('rules');
    let rules: RulesByCategory = {};
    
    if (storedRules) {
      rules = JSON.parse(storedRules) as RulesByCategory;
    } else {
      rules = createInitialRuleStructure();
    }
    
    // Find and update the rule
    Object.keys(rules).forEach(category => {
      const ruleIndex = rules[category].findIndex(r => r.id === rule.id);
      if (ruleIndex !== -1) {
        rules[category][ruleIndex] = { ...rules[category][ruleIndex], ...rule };
      }
    });
    
    // Save back to localStorage
    localStorage.setItem('rules', JSON.stringify(rules));
    return rule;
  } catch (error) {
    console.error("Error updating rule:", error);
    throw error;
  }
};
