const ProjectReportType = require('../../model/projectReportType.js');
const ProcessExecutor = require("./generateHtmlProcessExecutor.js");
const GenerateSectionHeaderHTML = require("./header/generateSectionHeaderHtml.js");
const GenerateVisualSectionHTML = require("./visualSection/generateVisualSectionHtml.js");
const GenerateSectionInvasiveHTML = require("./invasiveOnly/generateSectionInvasiveOnly.js");
const GenerateSectionConclusiveHTML = require("./conclusive/generateSectionConclusiveHtml.js");

class SectionPartProcessExecutorFactory {
    
    getProcessExecutorChain(location,sectionName,sectionId,sectionImageProperties,reportType)
    {
        const processExecutor = new ProcessExecutor();
        const generateSectionHeaderHTML = new GenerateSectionHeaderHTML(location,sectionName,reportType);
        const generateVisualSectionHtml = new GenerateVisualSectionHTML(sectionId,sectionImageProperties);
        const generateInvasiveSectionHtml = new GenerateSectionInvasiveHTML(sectionId,sectionImageProperties);
        const generateConclusiveSectionHtml = new GenerateSectionConclusiveHTML(sectionId,sectionImageProperties);
        if(ProjectReportType.VISUALREPORT === reportType)
        {
            processExecutor.addProcess(generateSectionHeaderHTML);
            processExecutor.addProcess(generateVisualSectionHtml);
            return processExecutor;
        }
        else if(ProjectReportType.INVASIVEVISUAL === reportType)
        {
            processExecutor.addProcess(generateSectionHeaderHTML);
            processExecutor.addProcess(generateVisualSectionHtml);
            processExecutor.addProcess(generateInvasiveSectionHtml);
            processExecutor.addProcess(generateConclusiveSectionHtml);
            return processExecutor;
        }
        else if(ProjectReportType.INVASIVEONLY === reportType)
        {
            processExecutor.addProcess(generateSectionHeaderHTML);
            processExecutor.addProcess(generateInvasiveSectionHtml);
            processExecutor.addProcess(generateConclusiveSectionHtml);
            return processExecutor;
        }
    }
}

module.exports = new SectionPartProcessExecutorFactory();