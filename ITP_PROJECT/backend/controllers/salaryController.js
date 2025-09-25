// const Salary = require('../models/salaryModel');

// exports.createSalary = async (req, res) => {
//   try {
//     const { employeeName, role, basicSalary, allowances, deductions, paymentDate, otHours, otRate, epfRate, etfRate } = req.body;

//     // Create the salary record
//     const salary = new Salary({
//       employeeName,
//       role,
//       basicSalary,
//       allowances,
//       deductions,
//       otHours,
//       otRate,
//       epfRate,
//       etfRate,
//       paymentDate,
//       status: 'Pending',
//     });

//     // Save salary in the database
//     await salary.save();
    
//     res.status(201).json({ 
//       success: true, 
//       message: "Salary created successfully", 
//       data: salary 
//     });
//   } catch ( error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// exports.getAllSalaries = async (req, res) => {
//   try {
//     const { month, year, status } = req.query;
//     let filter = {};
    
//     if (month && year) {
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0);
      
//       filter.paymentDate = {
//         $gte: startDate,
//         $lte: endDate
//       };
//     }
    
//     if (status) filter.status = status;
    
//     const salaries = await Salary.find(filter);
    
//     res.status(200).json({ 
//       success: true, 
//       data: salaries 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// exports.getSalary = async (req, res) => {
//   try {
//     const salary = await Salary.findById(req.params.id);
    
//     if (!salary) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Salary record not found" 
//       });
//     }
    
//     res.status(200).json({ 
//       success: true, 
//       data: salary 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// exports.updateSalaryStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["Pending", "Paid"].includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid status value" 
//       });
//     }

//     const salary = await Salary.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!salary) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Salary record not found" 
//       });
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: `Salary status updated to ${status}`, 
//       data: salary 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// exports.deleteSalary = async (req, res) => {
//   try {
//     const salary = await Salary.findByIdAndDelete(req.params.id);

//     if (!salary) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Salary record not found" 
//       });
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: "Salary record deleted successfully" 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// exports.getSalarySummary = async (req, res) => {
//   try {
//     const { year, month } = req.query;
//     let matchStage = {};
    
//     if (year) {
//       matchStage.paymentDate = {
//         $gte: new Date(`${year}-01-01`),
//         $lte: new Date(`${year}-12-31`)
//       };
//     }
    
//     if (month && year) {
//       matchStage.paymentDate = {
//         $gte: new Date(`${year}-${month}-01`),
//         $lte: new Date(`${year}-${month}-31`)
//       };
//     }
    
//     const summary = await Salary.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: '$role',
//           totalSalary: { $sum: '$netSalary' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { totalSalary: -1 } }
//     ]);
    
//     const totalSalaries = await Salary.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$netSalary' }
//         }
//       }
//     ]);
    
//     res.status(200).json({ 
//       success: true, 
//       data: {
//         byRole: summary,
//         total: totalSalaries[0]?.total || 0
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };


const Salary = require('../models/salaryModel');

exports.createSalary = async (req, res) => {
  try {
    const { employeeName, role, basicSalary, allowances, deductions, paymentDate, otHours, otRate, epfRate, etfRate } = req.body;

    // Validate required fields
    if (!employeeName || !role || !basicSalary || !paymentDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Employee name, role, basic salary, and payment date are required" 
      });
    }

    // Parse numeric values
    const parsedBasicSalary = parseFloat(basicSalary);
    const parsedAllowances = parseFloat(allowances) || 0;
    const parsedDeductions = parseFloat(deductions) || 0;
    const parsedOtHours = parseFloat(otHours) || 0;
    const parsedOtRate = parseFloat(otRate) || 1.5;
    const parsedEpfRate = parseFloat(epfRate) || 8;
    const parsedEtfRate = parseFloat(etfRate) || 3;

    // Calculate salary components manually (since pre-save hook might not work)
    const hourlyRate = parsedBasicSalary / 160;
    const otPay = parsedOtHours * hourlyRate * parsedOtRate;
    const epfDeduction = (parsedBasicSalary + otPay) * (parsedEpfRate / 100);
    const etfDeduction = (parsedBasicSalary + otPay) * (parsedEtfRate / 100);
    const netSalary = parsedBasicSalary + otPay + parsedAllowances - (parsedDeductions + epfDeduction + etfDeduction);

    // Create the salary record with all calculated fields
    const salary = new Salary({
      employeeName,
      role,
      basicSalary: parsedBasicSalary,
      allowances: parsedAllowances,
      deductions: parsedDeductions,
      otHours: parsedOtHours,
      otRate: parsedOtRate,
      otPay: otPay,
      epfRate: parsedEpfRate,
      epfDeduction: epfDeduction,
      etfRate: parsedEtfRate,
      etfDeduction: etfDeduction,
      netSalary: netSalary > 0 ? netSalary : 0,
      paymentDate,
      status: 'Pending',
    });

    // Save salary in the database
    await salary.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Salary created successfully", 
      data: salary 
    });
  } catch (error) {
    console.error('Error creating salary:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    let filter = {};
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      filter.paymentDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    if (status) filter.status = status;
    
    const salaries = await Salary.find(filter);
    
    res.status(200).json({ 
      success: true, 
      data: salaries 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    
    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary record not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: salary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.updateSalaryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Paid"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }

    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary record not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Salary status updated to ${status}`, 
      data: salary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);

    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary record not found" 
      });
    }

    res.status(200).json({ 
      success: false, 
      message: "Salary record deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getSalarySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    let matchStage = {};
    
    if (year) {
      matchStage.paymentDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    
    if (month && year) {
      matchStage.paymentDate = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    }
    
    const summary = await Salary.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$role',
          totalSalary: { $sum: '$netSalary' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSalary: -1 } }
    ]);
    
    const totalSalaries = await Salary.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: '$netSalary' }
        }
      }
    ]);
    
    res.status(200).json({ 
      success: true, 
      data: {
        byRole: summary,
        total: totalSalaries[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};