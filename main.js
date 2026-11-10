function setLang(l) {
    currentLang = l;
    document.querySelectorAll(".btn-lang").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-" + l)?.classList.add("active");
    render();
}

function setRole(r) {
    currentRole = r;
    document.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("active"));
    document.querySelector(`[data-role="${ r }"]`).classList.add("active");
    render();
}

function render() {
    const roleInfo = rolesData[currentRole];
    const container = document.getElementById("cv-container");

    // Fix logic lọc dự án chặt chẽ: Ẩn hoàn toàn dự án không có task tương ứng với role hiện tại
    const filteredProjects = projects.filter((p) => {
        if (p.tasks.common) return true;
        return p.tasks[currentRole] && p.tasks[currentRole].length > 0;
    });

    container.innerHTML = `
                <div class="page">
                    <header>
                        <div class="header-top">
                            <h1>${ data.personal.name[currentLang] }</h1>
                            <div class="subtitle">${ roleInfo.name[currentLang] }</div>
                        </div>
                            <div class="contact-grid">
                        ${ data.personal.contact
            .map(
                (row) => `
                            <div class="contact-row">
                                ${ row.map((c) => `<span>${ c }</span>`).join(" • ") }
                            </div>
                        `,
            )
            .join("") }
                    </div>
                    </header>

                    <section>
                        <div class="section-title">${ data.labels[currentLang].summary }</div>
                        <p>${ roleInfo.summary[currentLang] }</p>
                    </section>

                    <section>
                        <div class="section-title">${ data.labels[currentLang].skills }</div>
                        ${ roleInfo.skills
            .map(
                (s) => `
                            <div class="skill-group">
                                <div class="skill-label">${ s.l[currentLang] }</div>
                                <div>${ s.i.map((t) => `<span class="tag">${ t }</span>`).join(" ") }</div>
                            </div>
                        `,
            )
            .join("") }
                        <div class="skill-group">
                            <div class="skill-label">${ data.labels[currentLang].softSkills }</div>
                            <div>${ softSkills[currentLang].map((s) => `<span class="tag" style="...">${ s }</span>`).join(" ") }</div>
                        </div>
                    </section>

                    <section>
                        <div class="section-title">${ data.labels[currentLang].exp }</div>
                        ${ filteredProjects
            .map((p) => {
                let tasks = [];
                if (p.tasks.common) {
                    tasks = p.tasks.common;
                } else {
                    tasks = p.tasks[currentRole] || [];
                }

                if (tasks.length === 0) return "";

                return `
                                <div class="card">
                                    <div class="card-header">
                                        <div class="project-info">
                                            <span class="card-title">${ p.n }</span>
                                            <span style="color:var(--border); font-weight:normal">|</span>
                                            <span class="card-role">${ roleInfo.name[currentLang] }</span>
                                        </div>
                                        <div class="card-date">${ p.url ? p.url + " - " : "" }${ p.d }</div>
                                    </div>
                                    <div class="project-desc">${ p.desc[currentLang] }</div>
                                    
                                    <ul>${ tasks.map((t) => `<li>${ t[currentLang] }</li>`).join("") }</ul>
                                </div>
                            `;
            })
            .join("") }
                    </section>

                    <section>
                        <div class="section-title">${ data.labels[currentLang].edu }</div>
                        ${ data.edu[currentLang].map((s) => `<p><b>${ s }</b></p>`).join("") }
                    </section>
                </div>
            `;
}

function exportPDF() {
    const roleMap = {
        fullstack: "SE",
        be: "BE",
        fe: "FE",
    };

    const langMap = {
        en: "EN",
        vi: "VI",
    };

    const fileName = `trantuanthinh_${ roleMap[currentRole] }_${ langMap[currentLang] }`;

    const originalTitle = document.title;
    document.title = fileName;

    window.print();

    setTimeout(() => {
        document.title = originalTitle;
    }, 500);
}

async function exportAllPDFs() {
    const combinations = [
        { role: "fullstack", lang: "en" },
        { role: "fullstack", lang: "vi" },

        { role: "be", lang: "en" },
        { role: "be", lang: "vi" },

        { role: "fe", lang: "en" },
        { role: "fe", lang: "vi" },
    ];

    const roleMap = {
        fullstack: "SE",
        be: "BE",
        fe: "FE",
    };

    const langMap = {
        en: "EN",
        vi: "VI",
    };

    const originalRole = currentRole;
    const originalLang = currentLang;
    const originalTitle = document.title;

    for (const item of combinations) {
        currentRole = item.role;
        currentLang = item.lang;

        render();

        document.querySelectorAll(".btn-lang").forEach((b) => b.classList.remove("active"));
        document.getElementById("btn-" + currentLang).classList.add("active");

        document.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("active"));
        document.querySelector(`[data-role="${ currentRole }"]`).classList.add("active");

        const fileName = `trantuanthinh_${ roleMap[currentRole] }_${ langMap[currentLang] }`;

        document.title = fileName;

        await new Promise((resolve) => setTimeout(resolve, 300));

        window.print();

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    currentRole = originalRole;
    currentLang = originalLang;

    document.title = originalTitle;

    render();

    document.querySelectorAll(".btn-lang").forEach((b) => b.classList.remove("active"));
    document.getElementById("btn-" + currentLang).classList.add("active");

    document.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("active"));
    document.querySelector(`[data-role="${ currentRole }"]`).classList.add("active");
}

window.onload = render;
